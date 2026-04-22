# Sorbo NFC Demo — Menú Digital con Asistente IA

Demo interactivo para presentación a inversores de OpenSyntheAI.

---

## SETUP PASO A PASO (VS Code)

### Requisitos previos
- Node.js 18+ instalado (descarga en https://nodejs.org)
- VS Code instalado
- Cuenta en GitHub (https://github.com)
- Cuenta en Vercel (https://vercel.com) — regístrate con GitHub, es gratis

### Paso 1 — Crear el proyecto

Abre una terminal (en VS Code: Ctrl + `) y ejecuta:

```bash
# Navega a donde guardas tus proyectos
cd ~/Documentos

# Crea la carpeta (si la descargaste de Claude, descomprímela aquí)
# Si NO la descargaste, crea las carpetas manualmente:
mkdir sorbo-nfc-demo
cd sorbo-nfc-demo
```

### Paso 2 — Copiar los archivos

Copia TODOS los archivos del proyecto dentro de `sorbo-nfc-demo/`.
La estructura debe quedar así:

```
sorbo-nfc-demo/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js      ← Proxy de OpenAI (tu key NUNCA llega al navegador)
│   ├── globals.css            ← Estilos globales
│   ├── layout.js              ← Layout base de Next.js
│   └── page.js                ← El menú completo con asistente IA
├── public/
│   └── manifest.json          ← Configuración PWA
├── .env.local                 ← TU API KEY (NUNCA se sube a GitHub)
├── .env.example               ← Template sin key real
├── .gitignore                 ← Ignora node_modules, .env.local, .next
├── next.config.js             ← Config de Next.js
├── package.json               ← Dependencias
└── README.md                  ← Este archivo
```

### Paso 3 — Configurar tu API Key

Abre `.env.local` en VS Code y reemplaza la clave:

```
OPENAI_API_KEY=sk-proj-TU_CLAVE_REAL_AQUI
```

⚠️ IMPORTANTE: Este archivo NUNCA se sube a GitHub gracias al .gitignore.

### Paso 4 — Instalar dependencias

En la terminal de VS Code:

```bash
npm install
```

Espera a que termine (puede tardar 1-2 minutos).

### Paso 5 — Probar en local

```bash
npm run dev
```

Abre http://localhost:3000 en Chrome. Deberías ver la pantalla de splash de Sorbo.

Para probar en tu celular (misma red WiFi):
1. En la terminal verás algo como `- Local: http://localhost:3000`
2. También verás `- Network: http://192.168.x.x:3000`
3. Abre esa IP de Network en el navegador de tu celular

### Paso 6 — Subir a GitHub

```bash
git init
git add .
git commit -m "Sorbo NFC Demo v1 — Menú digital con asistente IA"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sorbo-nfc-demo.git
git push -u origin main
```

(Primero crea el repo vacío en github.com → New Repository → nombre: sorbo-nfc-demo → NO marques "Add README")

### Paso 7 — Deploy en Vercel (la URL para inversores)

1. Ve a https://vercel.com/new
2. Importa tu repo de GitHub (sorbo-nfc-demo)
3. Vercel detecta que es Next.js automáticamente
4. **IMPORTANTE**: Antes de hacer deploy, agrega la variable de entorno:
   - Nombre: `OPENAI_API_KEY`
   - Valor: tu clave `sk-proj-...`
   - Click en "Add"
5. Click en "Deploy"
6. En ~1 minuto tendrás tu URL: `https://sorbo-nfc-demo.vercel.app`

Esa URL es la que compartes en el Google Meet con tus inversores.

---

## CÓMO FUNCIONA

- **Menú**: Los datos del menú están embebidos en `page.js` (sin base de datos por ahora)
- **Asistente IA**: Cuando el usuario escribe, el mensaje va a `/api/chat/route.js` que llama a OpenAI GPT-4o-mini con un system prompt especializado en gastronomía y psicología del apetito
- **Voz**: El botón de micrófono usa Web Speech API (gratis, nativo de Chrome) para convertir voz a texto
- **Tu API key**: SOLO existe en el servidor (Vercel). Nunca llega al navegador del usuario

## COSTOS

- **Vercel**: Gratis (hobby plan, suficiente para demos)
- **OpenAI GPT-4o-mini**: ~$0.15/1M tokens input, ~$0.60/1M tokens output
- **Estimado para el demo**: < $0.50 por toda la presentación
- **Web Speech API**: Gratis

---

Powered by OpenSyntheAI
