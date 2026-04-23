const NUMBER_WORDS = {
  un: 1,
  una: 1,
  uno: 1,
  otra: 1,
  otro: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
};

const ADD_INTENT_PATTERNS = [
  'quiero',
  'quisiera',
  'me gustaria',
  'voy a querer',
  'dame',
  'me das',
  'agrega',
  'anota',
  'ponme',
  'pon',
  'suma',
  'sumame',
  'para mi',
];

const CONFIRM_INTENT_PATTERNS = [
  'confirma el pedido',
  'confirma pedido',
  'confirma',
  'confirmalo',
  'confirmamelo',
  'haz el pedido',
  'hazlo',
  'procesa el pedido',
  'procesalo',
  'listo confirmalo',
  'listo confirmamelo',
];

const SIMPLE_NOTE_PATTERNS = [
  'sin cebolla',
  'extra queso',
];

const LEADING_FILLER_PATTERN = /^(?:ok|okay|bueno|ya|listo|dale|este|eh|aja|mira|por favor|esta bien|ta bien)\s+/;

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function titleCase(value = '') {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function extractCustomerName(transcript) {
  const match = transcript.match(/(?:me llamo|mi nombre es|soy)\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,60})/i);
  if (!match?.[1]) return null;

  const rawName = match[1]
    .split(/\b(?:y|para|quiero|quisiera|me gustaría|me gustaria|voy|dame|agrega|anota|pon|confirma|haz|procesa)\b/i)[0]
    .trim();

  if (!rawName) return null;
  return titleCase(rawName);
}

function detectOrderType(normalizedTranscript) {
  if (!normalizedTranscript) return null;
  if (
    normalizedTranscript.includes('a domicilio') ||
    normalizedTranscript.includes('delivery') ||
    normalizedTranscript.includes('domicilio')
  ) {
    return 'delivery';
  }
  if (
    normalizedTranscript.includes('para comer aqui') ||
    normalizedTranscript.includes('comer aqui') ||
    normalizedTranscript.includes('en el local')
  ) {
    return 'dine_in';
  }
  if (
    normalizedTranscript.includes('para llevar') ||
    normalizedTranscript.includes('pickup') ||
    normalizedTranscript.includes('para recoger') ||
    normalizedTranscript.includes('recoger') ||
    normalizedTranscript.includes('retirar')
  ) {
    return 'pickup';
  }
  return null;
}

function detectSimpleNote(normalizedTranscript) {
  return SIMPLE_NOTE_PATTERNS.find((note) => normalizedTranscript.includes(note)) || null;
}

function hasAddIntent(normalizedTranscript) {
  return ADD_INTENT_PATTERNS.some((pattern) => normalizedTranscript.includes(pattern));
}

function hasConfirmIntent(normalizedTranscript) {
  return CONFIRM_INTENT_PATTERNS.some((pattern) => normalizedTranscript.includes(pattern));
}

function stripLeadingFillers(normalizedTranscript) {
  let nextValue = normalizedTranscript;
  let previousValue = '';

  while (nextValue && nextValue !== previousValue) {
    previousValue = nextValue;
    nextValue = nextValue.replace(LEADING_FILLER_PATTERN, '').trim();
  }

  return nextValue;
}

function hasStandaloneQuantityProductTurn(normalizedTranscript, normalizedProductName) {
  const cleanedTranscript = stripLeadingFillers(normalizedTranscript);
  const escapedName = escapeRegExp(normalizedProductName);
  const regex = new RegExp(`^(\\d+|un|una|uno|otra|otro|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\\s+${escapedName}(?:\\s|$)`);
  return regex.test(normalizedTranscript) || regex.test(cleanedTranscript);
}

function isDirectProductSelection(normalizedTranscript, normalizedProductName) {
  const cleanedTranscript = stripLeadingFillers(normalizedTranscript);
  return (
    normalizedTranscript === normalizedProductName ||
    cleanedTranscript === normalizedProductName ||
    hasStandaloneQuantityProductTurn(normalizedTranscript, normalizedProductName)
  );
}

function extractQuantity(normalizedTranscript, normalizedProductName) {
  const escapedName = escapeRegExp(normalizedProductName);
  const regex = new RegExp(`(?:^|\\s)(\\d+|un|una|uno|otra|otro|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\\s+${escapedName}(?:\\s|$)`);
  const match = normalizedTranscript.match(regex);

  if (!match?.[1]) {
    return 1;
  }

  const rawValue = match[1];
  if (/^\d+$/.test(rawValue)) {
    return Number.parseInt(rawValue, 10);
  }

  return NUMBER_WORDS[rawValue] || 1;
}

function findCatalogMatches(normalizedTranscript, catalog) {
  const matches = [];
  const occupiedRanges = [];

  for (const item of catalog) {
    const index = normalizedTranscript.indexOf(item.normalizedName);
    if (index === -1) continue;

    const range = [index, index + item.normalizedName.length];
    const overlaps = occupiedRanges.some(([start, end]) => range[0] < end && range[1] > start);
    if (overlaps) continue;

    occupiedRanges.push(range);
    matches.push(item);
  }

  return matches;
}

function mergeItemNotes(existingNotes, nextNotes) {
  if (!nextNotes) return existingNotes || null;
  if (!existingNotes) return nextNotes;
  if (normalizeText(existingNotes).includes(normalizeText(nextNotes))) {
    return existingNotes;
  }
  return `${existingNotes}; ${nextNotes}`;
}

function buildUpdateReply({ addItem, updateLastItemNotes, customerName, orderType, draft }) {
  if (addItem) {
    const quantityLabel = addItem.quantity > 1 ? `${addItem.quantity} ` : '';
    const notesLabel = addItem.notes ? ` con nota: ${addItem.notes}` : '';
    return `Anote ${quantityLabel}${addItem.name}${notesLabel}.`;
  }

  if (updateLastItemNotes && draft.items.length) {
    const lastItem = draft.items[draft.items.length - 1];
    return `Listo, se lo anote a ${lastItem.name}: ${updateLastItemNotes}.`;
  }

  if (customerName && orderType) {
    return `Perfecto, el pedido va a nombre de ${customerName} y lo marco como ${orderType === 'pickup' ? 'para llevar' : orderType === 'delivery' ? 'delivery' : 'consumo en el local'}.`;
  }

  if (customerName) {
    return `Perfecto, el pedido va a nombre de ${customerName}.`;
  }

  if (orderType) {
    return `Perfecto, lo marco como ${orderType === 'pickup' ? 'para llevar' : orderType === 'delivery' ? 'delivery' : 'consumo en el local'}.`;
  }

  return null;
}

export function createEmptyOrderDraft() {
  return {
    customer_name: '',
    notes: '',
    items: [],
    order_type: '',
    scheduled_for: null,
  };
}

export function buildMenuItemCatalog(menu) {
  return Object.values(menu)
    .flatMap((category) => category.items || [])
    .map((item) => ({
      name: item.name,
      normalizedName: normalizeText(item.name),
    }))
    .sort((a, b) => b.normalizedName.length - a.normalizedName.length);
}

export function applyParsedTurnToDraft(draft, parsedTurn) {
  if (!parsedTurn?.handled || !parsedTurn.changes) {
    return draft;
  }

  const nextDraft = {
    ...draft,
    items: [...draft.items],
  };

  if (parsedTurn.changes.customer_name) {
    nextDraft.customer_name = parsedTurn.changes.customer_name;
  }

  if (parsedTurn.changes.order_type) {
    nextDraft.order_type = parsedTurn.changes.order_type;
  }

  if (Object.prototype.hasOwnProperty.call(parsedTurn.changes, 'scheduled_for')) {
    nextDraft.scheduled_for = parsedTurn.changes.scheduled_for;
  }

  if (parsedTurn.changes.update_last_item_notes && nextDraft.items.length) {
    const lastIndex = nextDraft.items.length - 1;
    nextDraft.items[lastIndex] = {
      ...nextDraft.items[lastIndex],
      notes: mergeItemNotes(nextDraft.items[lastIndex].notes, parsedTurn.changes.update_last_item_notes),
    };
  }

  if (parsedTurn.changes.add_item) {
    const candidate = parsedTurn.changes.add_item;
    const existingIndex = nextDraft.items.findIndex((item) =>
      normalizeText(item.name) === normalizeText(candidate.name) &&
      normalizeText(item.notes || '') === normalizeText(candidate.notes || ''),
    );

    if (existingIndex >= 0) {
      nextDraft.items[existingIndex] = {
        ...nextDraft.items[existingIndex],
        quantity: nextDraft.items[existingIndex].quantity + candidate.quantity,
      };
    } else {
      nextDraft.items.push(candidate);
    }
  }

  return nextDraft;
}

export function parseOrderDraftTurn({ transcript, draft, catalog }) {
  const normalizedTranscript = normalizeText(transcript);
  if (!normalizedTranscript) {
    return { handled: false };
  }

  const customerName = extractCustomerName(transcript);
  const orderType = detectOrderType(normalizedTranscript);
  const simpleNote = detectSimpleNote(normalizedTranscript);
  const productMatches = findCatalogMatches(normalizedTranscript, catalog);
  const addIntent = hasAddIntent(normalizedTranscript);
  const confirmIntent = hasConfirmIntent(normalizedTranscript);

  if (confirmIntent) {
    return {
      handled: true,
      action: 'confirm',
      changes: {
        customer_name: customerName || null,
        order_type: orderType || null,
      },
      replyText: null,
    };
  }

  if (productMatches.length > 1 && addIntent) {
    return {
      handled: true,
      action: 'clarify',
      changes: {
        customer_name: customerName || null,
        order_type: orderType || null,
      },
      replyText: 'Para no equivocarme, pidemelos uno por vez y yo los voy anotando.',
    };
  }

  if (productMatches.length > 1 && !addIntent && productMatches.some((product) => hasStandaloneQuantityProductTurn(normalizedTranscript, product.normalizedName))) {
    return {
      handled: true,
      action: 'clarify',
      changes: {
        customer_name: customerName || null,
        order_type: orderType || null,
      },
      replyText: 'Para no equivocarme, pidemelos uno por vez y yo los voy anotando.',
    };
  }

  if (productMatches.length === 1 && (addIntent || isDirectProductSelection(normalizedTranscript, productMatches[0].normalizedName))) {
    const product = productMatches[0];
    const quantity = extractQuantity(normalizedTranscript, product.normalizedName);

    return {
      handled: true,
      action: 'update',
      changes: {
        customer_name: customerName || null,
        order_type: orderType || null,
        add_item: {
          name: product.name,
          quantity,
          notes: simpleNote,
        },
      },
      replyText: buildUpdateReply({
        addItem: {
          name: product.name,
          quantity,
          notes: simpleNote,
        },
      }),
    };
  }

  if (simpleNote && draft.items.length && !productMatches.length) {
    return {
      handled: true,
      action: 'update',
      changes: {
        customer_name: customerName || null,
        order_type: orderType || null,
        update_last_item_notes: simpleNote,
      },
      replyText: buildUpdateReply({
        updateLastItemNotes: simpleNote,
        draft,
      }),
    };
  }

  if (customerName || orderType) {
    return {
      handled: true,
      action: 'update',
      changes: {
        customer_name: customerName || null,
        order_type: orderType || null,
      },
      replyText: buildUpdateReply({
        customerName,
        orderType,
      }),
    };
  }

  return { handled: false };
}
