import './globals.css';

export const metadata = {
  title: 'Sorbo Café • Bistró — Menú Digital',
  description: 'Experiencia gastronómica digital con asistente IA. Sorbo Café Bistró, Los Puertos de Altagracia.',
  manifest: '/manifest.json',
  themeColor: '#0B0F1A',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
