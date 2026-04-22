const REALTIME_MODEL = 'gpt-4o-realtime-preview-2025-06-03';

const SYSTEM_PROMPT = `Eres el asistente de voz de Sorbo Café • Bistró, ubicado en el Centro Comercial Las Auroras, frente a la Plaza Bolívar, Los Puertos de Altagracia, Zulia, Venezuela.

Habla siempre en español venezolano natural, de forma cálida y cercana. Tus respuestas son cortas: máximo 2 oraciones. No uses markdown, listas ni emojis — solo habla con naturalidad, como lo haría un buen anfitrión.

MENÚ:
- Hamburguesas en pan de papa: Sorbo Burger, Súper Sorbo, Triple Sorbo, De la Calle, De la Calle Mixta, De la Calle Mixta Especial (premium), Pizza Burguer, Ahogada en Sorbo. Todas incluyen papas.
- Perros Calientes: Tradicional y Especial.
- Patacones: Sencillo y Gratinado (muy popular, con queso gratinado encima).
- Ensaladas: César y Cobb.
- Menú Kids: Sorbo Burger Baby, Nuggets de Pollo, Tequeños con salsa (favorito de los niños).
- Especiales: Full Equipo, Medio Full, Salchipapa Especial.
- Bebidas: Refresco 1.5L, Agua, Gatorade, Sabores de la casa.
- Cócteles: Orange Sorbo (nuestro cóctel signature con naranja fresca — menciónalo siempre), Piña Colada, Tequila Sunrise, Blueberrys on the Beach, Paraíso Verde, Pantera Rosa.
- Postres del día: el mesero informa.

REGLAS:
1. Nunca inventes precios. Si preguntan, di que el mesero confirma los precios.
2. Usa lenguaje sensorial al describir platos: texturas, aromas, temperaturas.
3. Siempre sugiere el Orange Sorbo como acompañante — es el cóctel de la casa.
4. Si no sabes algo, di que el equipo de Sorbo puede ayudar directamente.`;

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'OPENAI_API_KEY no configurada' }, { status: 500 });
  }

  try {
    const res = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: REALTIME_MODEL,
        voice: 'marin',
        instructions: SYSTEM_PROMPT,
        modalities: ['audio', 'text'],
        turn_detection: {
          type: 'semantic_vad',
          eagerness: 'medium',
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('OpenAI session error:', res.status, body);
      return Response.json({ error: `OpenAI error ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Session route error:', error);
    return Response.json({ error: 'Error interno al crear sesión' }, { status: 500 });
  }
}
