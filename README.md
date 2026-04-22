# Sorbo NFC Demo

Demo de menú digital con asistente de IA conversacional por voz, diseñado para **Sorbo Café • Bistró** (Los Puertos de Altagracia, Venezuela).

> Demo funcional para presentación y experimentación. No es producción.

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| React 18 | UI |
| OpenAI `gpt-4o-mini` | Asistente conversacional |
| OpenAI `tts-1` | Síntesis de voz (voz: nova) |
| Web Speech API | STT nativo de Chrome (sin costo) |

---

## Funcionalidades actuales

- Menú completo embebido en el prompt del asistente (sin base de datos)
- Chat con IA especializada en gastronomía y psicología del apetito
- Voz bidireccional: entrada por micrófono (STT) + respuesta hablada (TTS)
- API key protegida server-side — nunca expuesta al cliente
- PWA-ready (`manifest.json`)

---

## Estructura del proyecto

```
sorbo-nfc-demo/
├── app/
│   ├── api/
│   │   ├── chat/route.js     # Proxy OpenAI chat (gpt-4o-mini)
│   │   └── tts/route.js      # Proxy OpenAI TTS (tts-1)
│   ├── globals.css
│   ├── layout.js
│   └── page.js               # UI principal: menú + asistente IA
├── public/
│   └── manifest.json         # Configuración PWA
├── .env.example
├── next.config.js
└── package.json
```

---

## Variables de entorno

Copia `.env.example` a `.env.local` y completa con tu clave:

```env
OPENAI_API_KEY=sk-proj-...
```

En Vercel, agrega la misma variable en **Project Settings → Environment Variables**.

---

## Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en Chrome. El STT por voz requiere Chrome o Edge.

Para probar desde el celular en la misma red WiFi, usa la URL `Network` que aparece en la terminal.

---

## Deploy en Vercel

```bash
npx vercel --prod
```

O importa el repo desde [vercel.com/new](https://vercel.com/new) — Vercel detecta Next.js automáticamente.

---

## Estado actual / próximos pasos

- [x] Menú estático con asistente IA conversacional
- [x] Voz bidireccional (STT + TTS)
- [x] API key protegida server-side
- [ ] Integración NFC real (trigger por tag físico)
- [ ] Menú dinámico desde CMS o base de datos
- [ ] Panel de administración para el restaurante
- [ ] Analíticas de interacciones del asistente
