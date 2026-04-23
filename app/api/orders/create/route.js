import { createSupabaseServiceRoleClient } from '../../../../lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CUSTOMER_SEARCH_COLUMNS = ['name', 'full_name'];
const MENU_ITEM_NAME_COLUMNS = ['name', 'title', 'product_name'];
const CUSTOMER_INSERT_VARIANTS = [
  (customerName) => ({ name: customerName }),
  (customerName) => ({ full_name: customerName }),
];
const ORDER_INSERT_VARIANTS = [
  ({ customerId, customerName, notes, orderType, scheduledFor, subtotal, total, ticketCode }) => ({
    customer_id: customerId,
    customer_name: customerName,
    notes,
    order_type: orderType,
    scheduled_for: scheduledFor,
    subtotal,
    total,
    ticket_code: ticketCode,
    status: 'pending',
  }),
  ({ customerId, customerName, notes, orderType, scheduledFor, subtotal, total, ticketCode }) => ({
    customer_id: customerId,
    notes,
    order_type: orderType,
    scheduled_for: scheduledFor,
    subtotal,
    total,
    ticket_code: ticketCode,
    status: 'pending',
  }),
  ({ customerId, customerName, notes, orderType, scheduledFor, subtotal, total, ticketCode }) => ({
    customer_id: customerId,
    customer_name: customerName,
    notes,
    order_type: orderType,
    scheduled_for: scheduledFor,
    subtotal,
    total,
    ticket_code: ticketCode,
  }),
  ({ customerId, customerName, notes, orderType, scheduledFor, subtotal, total, ticketCode }) => ({
    customer_id: customerId,
    notes,
    order_type: orderType,
    scheduled_for: scheduledFor,
    subtotal,
    total,
    ticket_code: ticketCode,
  }),
];
const ORDER_ITEM_VARIANTS = [
  ({ orderId, menuItemId, quantity, unitPrice, lineTotal, notes }) => ({
    order_id: orderId,
    menu_item_id: menuItemId,
    qty: quantity,
    unit_price: unitPrice,
    line_total: lineTotal,
    notes,
  }),
  ({ orderId, menuItemId, quantity, unitPrice, lineTotal }) => ({
    order_id: orderId,
    menu_item_id: menuItemId,
    qty: quantity,
    unit_price: unitPrice,
    line_total: lineTotal,
  }),
];

function isMissingColumnError(error) {
  const message = `${error?.message || ''} ${error?.details || ''}`.toLowerCase();
  return error?.code === 'PGRST204' || error?.code === '42703' || message.includes('column');
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeScheduledFor(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('scheduled_for inválido');
  }
  return date.toISOString();
}

function normalizeOrderItem(rawItem, index) {
  const quantity = Number.parseInt(rawItem?.quantity ?? 1, 10);
  const itemNotes = normalizeText(rawItem?.notes);
  const menuItemId = rawItem?.menu_item_id ?? rawItem?.menuItemId ?? rawItem?.product_id ?? rawItem?.productId ?? rawItem?.id ?? null;
  const slug = normalizeText(rawItem?.slug);
  const name = normalizeText(rawItem?.name ?? rawItem?.product_name ?? rawItem?.title);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error(`items[${index}].quantity inválido`);
  }

  if (!menuItemId && !slug && !name) {
    throw new Error(`items[${index}] debe incluir menu_item_id, slug o name`);
  }

  return {
    quantity,
    notes: itemNotes || null,
    menuItemId,
    slug: slug || null,
    name: name || null,
    label: name || slug || String(menuItemId),
  };
}

function getMenuItemName(menuItem) {
  return menuItem?.name || menuItem?.title || menuItem?.product_name || 'Producto';
}

function getMenuItemPrice(menuItem) {
  const candidates = [
    menuItem?.price,
    menuItem?.base_price,
    menuItem?.current_price,
    menuItem?.unit_price,
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function isMenuItemActive(menuItem) {
  if (typeof menuItem?.is_active === 'boolean') {
    return menuItem.is_active;
  }
  if (typeof menuItem?.active === 'boolean') {
    return menuItem.active;
  }
  return true;
}

function formatMoney(value) {
  return Number(value.toFixed(2));
}

function generateTicketCode() {
  const now = new Date();
  const day = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `SOR-${day}-${suffix}`;
}

async function insertWithFallback({ supabase, table, builders, context, single = false }) {
  let lastError = null;

  for (const buildPayload of builders) {
    const payload = buildPayload(context);
    const query = supabase.from(table).insert(payload).select('*');
    const result = single ? await query.single() : await query;

    if (!result.error) {
      return result;
    }

    lastError = result.error;
    if (!isMissingColumnError(result.error)) {
      break;
    }
  }

  throw lastError || new Error(`No se pudo insertar en ${table}`);
}

async function findOrCreateCustomer(supabase, customerName) {
  for (const column of CUSTOMER_SEARCH_COLUMNS) {
    const result = await supabase
      .from('customers')
      .select('*')
      .ilike(column, customerName)
      .limit(1)
      .maybeSingle();

    if (!result.error && result.data) {
      return result.data;
    }

    if (result.error && !isMissingColumnError(result.error)) {
      throw result.error;
    }
  }

  const inserted = await insertWithFallback({
    supabase,
    table: 'customers',
    builders: CUSTOMER_INSERT_VARIANTS,
    context: customerName,
    single: true,
  });

  return inserted.data;
}

async function fetchMenuItem(supabase, requestedItem) {
  if (requestedItem.menuItemId) {
    const byId = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', requestedItem.menuItemId)
      .maybeSingle();

    if (byId.data) return byId.data;
    if (byId.error && !byId.error.message?.toLowerCase().includes('0 rows')) {
      throw byId.error;
    }
  }

  if (requestedItem.slug) {
    const bySlug = await supabase
      .from('menu_items')
      .select('*')
      .eq('slug', requestedItem.slug)
      .maybeSingle();

    if (bySlug.data) return bySlug.data;
    if (bySlug.error && !isMissingColumnError(bySlug.error) && !bySlug.error.message?.toLowerCase().includes('0 rows')) {
      throw bySlug.error;
    }
  }

  if (requestedItem.name) {
    for (const column of MENU_ITEM_NAME_COLUMNS) {
      const byName = await supabase
        .from('menu_items')
        .select('*')
        .ilike(column, requestedItem.name)
        .limit(1)
        .maybeSingle();

      if (byName.data) return byName.data;
      if (byName.error && !isMissingColumnError(byName.error) && !byName.error.message?.toLowerCase().includes('0 rows')) {
        throw byName.error;
      }
    }
  }

  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const customerName = normalizeText(body?.customer_name);
    const notes = normalizeText(body?.notes) || null;
    const orderType = normalizeText(body?.order_type);
    const scheduledFor = normalizeScheduledFor(body?.scheduled_for);
    const itemsInput = Array.isArray(body?.items) ? body.items : [];

    if (!customerName) {
      return Response.json({ error: 'customer_name es requerido' }, { status: 400 });
    }

    if (!orderType) {
      return Response.json({ error: 'order_type es requerido' }, { status: 400 });
    }

    if (!itemsInput.length) {
      return Response.json({ error: 'items debe tener al menos un producto' }, { status: 400 });
    }

    const normalizedItems = itemsInput.map(normalizeOrderItem);
    const supabase = createSupabaseServiceRoleClient();
    const customer = await findOrCreateCustomer(supabase, customerName);
    const pricedItems = [];

    for (const requestedItem of normalizedItems) {
      const menuItem = await fetchMenuItem(supabase, requestedItem);

      if (!menuItem) {
        return Response.json(
          { error: `Producto no encontrado en menu_items: ${requestedItem.label}` },
          { status: 404 },
        );
      }

      if (!isMenuItemActive(menuItem)) {
        return Response.json(
          { error: `Producto inactivo en menu_items: ${getMenuItemName(menuItem)}` },
          { status: 409 },
        );
      }

      const unitPrice = getMenuItemPrice(menuItem);
      if (unitPrice === null) {
        return Response.json(
          { error: `El producto ${getMenuItemName(menuItem)} no tiene precio válido en la base de datos` },
          { status: 409 },
        );
      }

      pricedItems.push({
        menuItemId: menuItem.id,
        menuItemName: getMenuItemName(menuItem),
        quantity: requestedItem.quantity,
        unitPrice: formatMoney(unitPrice),
        lineTotal: formatMoney(unitPrice * requestedItem.quantity),
        notes: requestedItem.notes,
      });
    }

    const subtotal = formatMoney(pricedItems.reduce((sum, item) => sum + item.lineTotal, 0));
    const total = subtotal;

    let orderRow = null;
    let ticketCode = '';
    for (let attempt = 0; attempt < 3; attempt += 1) {
      ticketCode = generateTicketCode();
      try {
        const insertedOrder = await insertWithFallback({
          supabase,
          table: 'orders',
          builders: ORDER_INSERT_VARIANTS,
          context: {
            customerId: customer.id,
            customerName,
            notes,
            orderType,
            scheduledFor,
            subtotal,
            total,
            ticketCode,
          },
          single: true,
        });

        orderRow = insertedOrder.data;
        break;
      } catch (error) {
        if (error?.code !== '23505' || attempt === 2) {
          throw error;
        }
      }
    }

    if (!orderRow) {
      throw new Error('No se pudo crear la orden');
    }

    try {
      await insertWithFallback({
        supabase,
        table: 'order_items',
        builders: ORDER_ITEM_VARIANTS.map((builder) => (context) => context.map(builder)),
        context: pricedItems.map((item) => ({
          orderId: orderRow.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          notes: item.notes,
        })),
      });
    } catch (error) {
      await supabase.from('orders').delete().eq('id', orderRow.id);
      throw error;
    }

    return Response.json({
      ticket_code: ticketCode,
      total,
      summary: {
        order_id: orderRow.id,
        customer_name: customerName,
        order_type: orderType,
        scheduled_for: scheduledFor,
        subtotal,
        total,
        notes,
        items: pricedItems.map((item) => ({
          menu_item_id: item.menuItemId,
          name: item.menuItemName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal,
          notes: item.notes,
        })),
      },
    });
  } catch (error) {
    console.error('Create order error:', error);

    const message =
      error?.message === 'scheduled_for inválido'
        ? error.message
        : 'No se pudo crear el pedido';

    return Response.json({ error: message }, { status: message === 'scheduled_for inválido' ? 400 : 500 });
  }
}
