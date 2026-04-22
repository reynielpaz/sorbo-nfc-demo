# Sorbo NFC Demo

Demo de menú digital con asistente de IA conversacional por voz, diseñado para **Sorbo Café • Bistró** (Los Puertos de Altagracia, Venezuela).

> Demo funcional para presentación y experimentación. No es producción.

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| React 18 | UI |
| OpenAI Realtime API (WebRTC) | Voz conversacional en tiempo real |
| OpenAI `gpt-4o-realtime-preview` | Modelo realtime (voz: marin) |
| OpenAI `gpt-4o-mini` | Chat legado (fallback) |
| OpenAI `tts-1` | TTS legado (fallback) |

---

## Funcionalidades actuales

- Menú completo embebido en el prompt del asistente (sin base de datos)
- **Modo realtime (principal):** conversación de voz bidireccional con latencia baja via WebRTC
- Orbe animado con estados visuales: idle, connecting, listening, speaking, error
- Turn detection automática con `semantic_vad` — interrupciones naturales
- API key protegida server-side — el browser solo recibe un token efímero de corta vida
- Chat + TTS legado conservado en `/api/chat` y `/api/tts`
- PWA-ready (`manifest.json`)

---

## Estructura del proyecto

```
sorbo-nfc-demo/
├── app/
│   ├── api/
│   │   ├── session/route.js   # Genera token efímero para WebRTC (NUEVO)
│   │   ├── chat/route.js      # Proxy OpenAI chat legado (gpt-4o-mini)
│   │   └── tts/route.js       # Proxy OpenAI TTS legado (tts-1)
│   ├── globals.css
│   ├── layout.js
│   └── page.js                # UI voice-first: orbe + menú
├── public/
│   └── manifest.json
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

La misma variable sirve para el modo realtime y el chat legado. En Vercel, agrégala en **Project Settings → Environment Variables**.

---

## Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en **Chrome o Edge** (WebRTC + getUserMedia requieren contexto seguro o localhost).

Para probar desde el celular en la misma red WiFi, usa la URL `Network` que aparece en la terminal. El micrófono solo funciona en HTTPS — en producción Vercel lo resuelve automáticamente.

---

## Modo Realtime — cómo funciona

```
Browser → GET /api/session
  └─ Server → POST api.openai.com/v1/realtime/sessions (con OPENAI_API_KEY)
               └─ Devuelve { client_secret: { value: "ephemeral-token" } }

Browser → RTCPeerConnection + getUserMedia (micrófono)
Browser → DataChannel "oai-events"
Browser → POST api.openai.com/v1/realtime?model=... (con ephemeral token, SDP offer)
  └─ OpenAI responde con SDP answer → WebRTC conectado
  └─ Audio del modelo sale por ontrack → <Audio> element
```

El `OPENAI_API_KEY` nunca sale del servidor. El token efímero expira automáticamente.

---

## Deploy en Vercel

```bash
npx vercel --prod
```

O importa el repo desde [vercel.com/new](https://vercel.com/new) — Vercel detecta Next.js automáticamente. Agrega `OPENAI_API_KEY` en las variables de entorno del proyecto antes del primer deploy.

---

## Estado actual / próximos pasos

- [x] Menú estático con asistente IA
- [x] Modo realtime WebRTC (voz bidireccional de baja latencia)
- [x] Turn detection automática (`semantic_vad`)
- [x] API key protegida — token efímero para el browser
- [x] Orbe animado con estados visuales
- [ ] Integración NFC real (trigger por tag físico)
- [ ] Menú dinámico desde CMS o base de datos
- [ ] Panel de administración para el restaurante
- [ ] Analíticas de interacciones del asistente
