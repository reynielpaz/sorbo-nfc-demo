'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  gold: '#D4A853',
  goldDim: '#D4A85340',
  amber: '#E8943A',
  bg: '#0B0F1A',
  card: '#131825',
  elevated: '#1A1F2E',
  text: '#F5F0E8',
  textSec: '#9A8E7A',
  glass: 'rgba(212, 168, 83, 0.06)',
  border: 'rgba(212, 168, 83, 0.15)',
};

// ─── MENU DATA ───────────────────────────────────────────────
const MENU = {
  hamburguesas: {
    name: 'Hamburguesas', subtitle: 'Pan de Papa', icon: '🍔',
    items: [
      { id: 'h1', name: 'Sorbo Burger', desc: 'Carne o pollo, queso cheddar, tocineta, pepinillo, cebolla caramelizada, salsa de la casa', popular: true },
      { id: 'h2', name: 'Súper Sorbo', desc: 'Doble carne o pollo, doble queso cheddar, tocineta, pepinillo, cebolla caramelizada, salsa de la casa', tag: 'Doble' },
      { id: 'h3', name: 'Triple Sorbo', desc: 'Triple carne o pollo, triple queso cheddar, tocineta, pepinillo, cebolla caramelizada, salsa de la casa', tag: 'Triple' },
      { id: 'h4', name: 'De la Calle', desc: 'Pollo, lomo o chuleta, lechuga, tomate, tocineta, papas rayadas, jamón, queso cebú, salsas' },
      { id: 'h5', name: 'De la Calle Mixta', desc: 'Tres proteínas, lechuga, tomate, tocineta, papas rayadas, jamón, queso cebú, salsas' },
      { id: 'h6', name: 'De la Calle Mixta Especial', desc: '100gr lomo + 100gr pollo + 100gr cuarto de libra, lechuga, tomate, tocineta, papas rayadas, queso, jamón, salsas', tag: 'Premium' },
      { id: 'h7', name: 'Pizza Burguer', desc: 'Proteína a elección, salsa de pizza, lechuga, tomate, tocineta, papas, jamón, queso, cubierta de queso, maíz y peperoni' },
      { id: 'h8', name: 'Ahogada en Sorbo', desc: 'Proteína a elección, lechuga, tomate, tocineta, papas rayadas, queso, jamón, salsas' },
    ],
  },
  perros: {
    name: 'Perros Calientes', icon: '🌭',
    items: [
      { id: 'p1', name: 'Tradicional', desc: 'Salchicha, papas, lechuga, queso rallado, salsas' },
      { id: 'p2', name: 'Especial', desc: 'Proteína a elección, lechuga, queso, jamón, maíz, papitas, salsas', popular: true },
    ],
  },
  patacones: {
    name: 'Patacones', icon: '🫓',
    items: [
      { id: 'pa1', name: 'Patacón Sencillo', desc: 'Carne mechada, lechuga, tomate, huevo, queso cebú, salsas' },
      { id: 'pa2', name: 'Patacón Gratinado', desc: 'Carne mechada, lechuga, tomate, huevo, queso cebú, cubierto con queso gratinado, salsas', popular: true, tag: 'Gratinado' },
    ],
  },
  ensaladas: {
    name: 'Ensaladas', icon: '🥗',
    items: [
      { id: 'e1', name: 'César', desc: 'Lechuga, pollo, queso parmesano, cubos de pan, salsa aderezo' },
      { id: 'e2', name: 'Cobb', desc: 'Lechuga, huevo, pollo, tocino, maíz, aguacate, salsa aderezo' },
    ],
  },
  kids: {
    name: 'Menú Kids', icon: '👶',
    items: [
      { id: 'k1', name: 'Sorbo Burger Baby', desc: 'Carne, tocineta, queso cheddar, papas fritas (pan de papa)' },
      { id: 'k2', name: 'Nuggets de Pollo', desc: 'Papas fritas, salsa' },
      { id: 'k3', name: 'Tequeños', desc: '5 tequeños con salsa', popular: true },
    ],
  },
  especiales: {
    name: 'Especiales', icon: '⭐',
    items: [
      { id: 's1', name: 'Full Equipo', desc: 'La experiencia completa Sorbo con todos los acompañantes', tag: 'Full' },
      { id: 's2', name: 'Medio Full', desc: 'La versión media de nuestro Full Equipo' },
      { id: 's3', name: 'Salchipapa Especial', desc: 'Nuestra salchipapa con toppings especiales de la casa' },
    ],
  },
  bebidas: {
    name: 'Bebidas', icon: '🥤',
    items: [
      { id: 'b1', name: 'Refresco 1.5L', desc: 'Refresco familiar' },
      { id: 'b2', name: 'Agua', desc: 'Agua mineral' },
      { id: 'b3', name: 'Gatorade', desc: 'Bebida deportiva' },
      { id: 'b4', name: 'Sabores', desc: 'Bebidas de sabores variados de la casa' },
    ],
  },
  cocteles: {
    name: 'Cócteles', icon: '🍹',
    items: [
      { id: 'c1', name: 'Orange Sorbo', desc: 'Nuestro cóctel signature con naranja fresca', popular: true, tag: 'Signature' },
      { id: 'c2', name: 'Piña Colada', desc: 'Clásica piña colada cremosa' },
      { id: 'c3', name: 'Tequila Sunrise', desc: 'Tequila con jugo de naranja y granadina' },
      { id: 'c4', name: 'Blueberrys on the Beach', desc: 'Refrescante mezcla de arándanos con toque tropical' },
      { id: 'c5', name: 'Paraíso Verde', desc: 'Cóctel tropical con sabores de la casa' },
      { id: 'c6', name: 'Pantera Rosa', desc: 'Cóctel rosado con mezcla frutal' },
    ],
  },
  postres: {
    name: 'Postres', icon: '🍰',
    items: [
      { id: 'd1', name: 'Postres del Día', desc: 'Consulta con nuestro asistente los postres disponibles hoy' },
    ],
  },
};

const CATEGORIES = Object.keys(MENU);
const GREETING = 'Hola! Bienvenido a Sorbo Café Bistró. Soy tu asistente personal. Puedo ayudarte a elegir del menú, contarte sobre cualquier plato, o armar tu pedido. Qué se te antoja hoy?';

// ─── TTS HOOK ────────────────────────────────────────────────
function useTTS() {
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const cleanupAudio = useCallback((audio = audioRef.current, url = audioUrlRef.current) => {
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      try { audio.pause(); } catch {}
    }
    if (audioRef.current === audio) audioRef.current = null;
    if (audioUrlRef.current === url) audioUrlRef.current = null;
    if (url) URL.revokeObjectURL(url);
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text, onDone) => {
    if (!voiceEnabled || !text) return;
    cleanupAudio();
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audioUrlRef.current = url;
      audio.onended = () => {
        cleanupAudio(audio, url);
        if (onDone) onDone();
      };
      audio.onerror = () => { cleanupAudio(audio, url); };
      await audio.play();
    } catch { cleanupAudio(); }
  }, [cleanupAudio, voiceEnabled]);

  useEffect(() => () => cleanupAudio(), [cleanupAudio]);

  const stop = useCallback(() => {
    cleanupAudio();
  }, [cleanupAudio]);

  const toggle = useCallback(() => {
    if (isSpeaking) cleanupAudio();
    setVoiceEnabled(v => !v);
  }, [cleanupAudio, isSpeaking]);

  return { speak, stop, toggle, isSpeaking, voiceEnabled };
}

// ─── CHAT HOOK ───────────────────────────────────────────────
function useChat(tts, panelOpenRef) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [autoConversation, setAutoConversation] = useState(true);
  const initialized = useRef(false);
  const isTypingRef = useRef(false);
  const messagesRef = useRef([]);
  const recognitionRef = useRef(null);
  const startListeningRef = useRef(() => {});
  const autoConversationRef = useRef(true);
  const requestIdRef = useRef(0);
  const activeRequestIdRef = useRef(0);
  const activeControllerRef = useRef(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { autoConversationRef.current = autoConversation; }, [autoConversation]);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) { setListening(false); return; }
    recognitionRef.current = null;
    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      if (typeof recognition.abort === 'function') recognition.abort();
      else recognition.stop();
    } catch {}
    setListening(false);
  }, []);

  const continueConversation = useCallback(() => {
    if (!autoConversationRef.current || !panelOpenRef.current) return;
    startListeningRef.current?.();
  }, [panelOpenRef]);

  const cancelPendingRequest = useCallback(() => {
    activeRequestIdRef.current = 0;
    const controller = activeControllerRef.current;
    activeControllerRef.current = null;
    if (controller) {
      try { controller.abort(); } catch {}
    }
    isTypingRef.current = false;
    setIsTyping(false);
  }, []);

  const init = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;
    const greetingMessage = { role: 'assistant', text: GREETING };
    messagesRef.current = [greetingMessage];
    setMessages([greetingMessage]);
    tts.speak(GREETING, continueConversation);
  }, [continueConversation, tts]);

  const send = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || isTypingRef.current || !panelOpenRef.current) return;
    cancelPendingRequest();
    isTypingRef.current = true;
    stopListening();
    const userMsg = { role: 'user', text: trimmed };
    const nextMessages = [...messagesRef.current, userMsg];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setIsTyping(true);
    tts.stop();
    const requestId = ++requestIdRef.current;
    activeRequestIdRef.current = requestId;
    const controller = new AbortController();
    activeControllerRef.current = controller;
    try {
      const apiMessages = nextMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (activeRequestIdRef.current !== requestId || !panelOpenRef.current) return;
      const replyMessage = { role: 'assistant', text: data.reply };
      const updatedMessages = [...messagesRef.current, replyMessage];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      tts.speak(data.reply, continueConversation);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      if (activeRequestIdRef.current !== requestId || !panelOpenRef.current) return;
      const fallbackMessage = { role: 'assistant', text: 'Disculpa, tuve un problema. Puedes intentar de nuevo?' };
      const updatedMessages = [...messagesRef.current, fallbackMessage];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      tts.speak(fallbackMessage.text, continueConversation);
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = 0;
        activeControllerRef.current = null;
        isTypingRef.current = false;
        setIsTyping(false);
      }
    }
  }, [cancelPendingRequest, continueConversation, panelOpenRef, stopListening, tts]);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || isTypingRef.current || listening || tts.isSpeaking) return;
    tts.stop();
    stopListening();
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'es-VE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = e => {
      const transcript = e.results?.[0]?.[0]?.transcript?.trim();
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setListening(false);
      if (transcript) send(transcript);
    };
    recognition.onerror = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setListening(false);
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setListening(false);
    };
    try { recognition.start(); } catch { recognitionRef.current = null; setListening(false); }
  }, [isTyping, listening, send, stopListening, tts]);

  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);
  useEffect(() => () => cancelPendingRequest(), [cancelPendingRequest]);

  const toggleAutoConversation = useCallback(() => {
    setAutoConversation(v => !v);
  }, []);

  return {
    messages, isTyping, send, init, listening, autoConversation,
    toggleAutoConversation, startListeningRef, stopListening, cancelPendingRequest,
  };
}

// ─── SPLASH ──────────────────────────────────────────────────
function Splash({ onEnter }) {
  const [fade, setFade] = useState(false);
  const enter = () => { setFade(true); setTimeout(onEnter, 600); };
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse at 50% 30%, ${T.elevated} 0%, ${T.bg} 70%)`,
      opacity: fade ? 0 : 1, transition: 'opacity 0.6s ease',
    }}>
      <div style={{ animation: 'pulse-glow 2s ease-in-out infinite', marginBottom: 32 }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, boxShadow: `0 0 60px ${T.goldDim}`,
        }}>☕</div>
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: T.gold, letterSpacing: 4, fontWeight: 700 }}>SORBO</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textSec, letterSpacing: 6, marginTop: 6, textTransform: 'uppercase' }}>Café • Bistró</p>
      <div style={{ marginTop: 8, width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)` }} />
      <p style={{ fontSize: 12, color: T.textSec, marginTop: 40, opacity: 0.6 }}>Los Puertos de Altagracia, Zulia</p>
      <button onClick={enter} style={{
        marginTop: 40, padding: '14px 48px', border: `1px solid ${T.gold}`,
        background: 'transparent', color: T.gold, borderRadius: 50,
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: 'pointer',
        letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, transition: 'all 0.3s',
      }}
        onMouseEnter={e => { e.target.style.background = T.gold; e.target.style.color = T.bg; }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = T.gold; }}
      >Ver Menú</button>
      <p style={{ fontSize: 10, color: T.textSec, opacity: 0.4, position: 'absolute', bottom: 20 }}>Powered by OpenSyntheAI</p>
    </div>
  );
}

// ─── CHAT PANEL ──────────────────────────────────────────────
function ChatPanel({
  open, onClose, messages, onSend, isTyping, tts, listening,
  startListeningRef, onStopListening, autoConversation, onToggleAutoConversation,
}) {
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  const handleSend = () => {
    if (isTyping || !input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const handleVoice = () => {
    if (listening) { onStopListening(); return; }
    startListeningRef.current?.();
  };

  const quickActions = ['🔥 Recomiéndame algo', '🍹 Ver cócteles', '📋 Hacer pedido', '⏰ Horarios'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, pointerEvents: open ? 'all' : 'none' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)', opacity: open ? 1 : 0, transition: 'opacity 0.3s',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        maxHeight: '85vh', height: '85vh', background: T.bg,
        borderRadius: '24px 24px 0 0', border: `1px solid ${T.border}`, borderBottom: 'none',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${T.border}`, background: T.card,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              animation: tts.isSpeaking ? 'pulse-glow 1s ease infinite' : 'none',
            }}>☕</div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: T.text, fontWeight: 600 }}>Asistente Sorbo</h3>
              <p style={{ fontSize: 11, color: T.gold, fontWeight: 500 }}>
                {tts.isSpeaking ? '🔊 Hablando...' : isTyping ? 'Pensando...' : 'En línea'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onToggleAutoConversation} title={autoConversation ? 'Auto conversación activada' : 'Auto conversación desactivada'} style={{
              height: 36, padding: '0 12px', borderRadius: 18,
              background: autoConversation ? `${T.gold}30` : T.elevated,
              border: `1px solid ${autoConversation ? T.gold : T.border}`,
              color: autoConversation ? T.gold : T.textSec,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>Auto</button>
            <button onClick={tts.toggle} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: tts.voiceEnabled ? `${T.gold}30` : T.elevated,
              border: `1px solid ${tts.voiceEnabled ? T.gold : T.border}`,
              color: tts.voiceEnabled ? T.gold : T.textSec,
              fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{tts.voiceEnabled ? '🔊' : '🔇'}</button>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: '50%', background: T.elevated,
              border: `1px solid ${T.border}`, color: T.textSec, fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        </div>

        {listening && (
          <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
            <div style={{
              padding: '14px 16px', borderRadius: 18,
              background: T.glass, border: `1px solid ${T.goldDim}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
            }}>
              <div>
                <p style={{ fontSize: 16, color: T.text, fontWeight: 700 }}>Te escucho...</p>
                <p style={{ fontSize: 11, color: T.gold, marginTop: 4 }}>Habla con naturalidad. Enviaré tu mensaje al terminar.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 28, flexShrink: 0 }}>
                {[0, 0.15, 0.3, 0.45].map((delay, i) => (
                  <span key={i} style={{
                    width: 5, height: 28, borderRadius: 999,
                    background: `linear-gradient(180deg, ${T.gold}, ${T.amber})`,
                    transformOrigin: 'center bottom',
                    animation: `voice-wave 1s ease-in-out ${delay}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeSlideUp 0.3s ease both' }}>
              <div style={{ maxWidth: '82%', position: 'relative' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? `linear-gradient(135deg, ${T.gold}, ${T.amber})` : T.card,
                  color: m.role === 'user' ? T.bg : T.text,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6,
                  border: m.role === 'user' ? 'none' : `1px solid ${T.border}`,
                }}>{m.text}</div>
                {m.role === 'assistant' && (
                  <button onClick={() => tts.speak(m.text)} style={{
                    position: 'absolute', bottom: -6, right: -6,
                    width: 28, height: 28, borderRadius: '50%',
                    background: T.elevated, border: `1px solid ${T.border}`,
                    color: T.textSec, fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0.7, transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = T.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.color = T.textSec; }}
                  >🔊</button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex' }}>
              <div style={{
                padding: '12px 20px', borderRadius: '18px 18px 18px 4px',
                background: T.card, border: `1px solid ${T.border}`, display: 'flex', gap: 6, alignItems: 'center',
              }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ animation: `typingDot 1.4s ease infinite ${d}s`, width: 7, height: 7, borderRadius: '50%', background: T.gold, display: 'block' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
          {quickActions.map(q => (
            <button key={q} onClick={() => { if (isTyping) return; onSend(q); }} style={{
              padding: '8px 16px', borderRadius: 20, border: `1px solid ${T.border}`,
              background: T.glass, color: T.textSec, fontSize: 12,
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = T.gold; e.target.style.color = T.gold; }}
              onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.textSec; }}
            >{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px 24px', display: 'flex', gap: 10, alignItems: 'center',
          borderTop: `1px solid ${T.border}`, background: T.card,
        }}>
          <button onClick={handleVoice} aria-label={listening ? 'Detener conversación' : 'Activar micrófono'} style={{
            minWidth: listening ? 84 : 42, height: 42, padding: listening ? '0 12px' : 0,
            borderRadius: listening ? 12 : '50%', border: 'none',
            background: listening ? '#D84C4C' : T.elevated, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: listening ? 11 : 18, flexShrink: 0, color: listening ? '#FFF5F5' : T.textSec,
            fontWeight: listening ? 700 : 400, letterSpacing: listening ? 0.4 : 0,
            animation: listening ? 'pulse-glow 1s ease infinite' : 'none',
          }}>{listening ? 'Detener' : '🎤'}</button>
          <input ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={listening ? 'Te escucho...' : 'Escribe o usa el micrófono...'}
            style={{
              flex: 1, padding: '12px 18px', borderRadius: 24,
              background: T.elevated, border: `1px solid ${T.border}`,
              color: T.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none',
            }}
          />
          <button onClick={handleSend} disabled={!input.trim()} style={{
            width: 42, height: 42, borderRadius: '50%', border: 'none',
            background: input.trim() && !isTyping ? `linear-gradient(135deg, ${T.gold}, ${T.amber})` : T.elevated,
            color: input.trim() && !isTyping ? T.bg : T.textSec, fontSize: 18, flexShrink: 0,
            cursor: input.trim() && !isTyping ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── CARD ────────────────────────────────────────────────────
function Card({ item, idx, onAsk }) {
  return (
    <div style={{
      background: T.card, borderRadius: 16, padding: 20,
      border: `1px solid ${T.border}`, position: 'relative',
      animation: `fadeSlideUp 0.4s ease ${idx * 0.05}s both`,
    }}>
      {item.popular && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`,
          color: T.bg, fontSize: 10, fontWeight: 700, padding: '3px 10px',
          borderRadius: 20, letterSpacing: 1, textTransform: 'uppercase',
        }}>Popular</div>
      )}
      {item.tag && !item.popular && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: T.glass, color: T.gold, fontSize: 10, fontWeight: 600,
          padding: '3px 10px', borderRadius: 20, border: `1px solid ${T.border}`,
          letterSpacing: 1, textTransform: 'uppercase',
        }}>{item.tag}</div>
      )}
      <h3 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 18,
        color: T.text, marginBottom: 8, fontWeight: 600,
        paddingRight: (item.popular || item.tag) ? 70 : 0,
      }}>{item.name}</h3>
      <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>{item.desc}</p>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 12, color: T.textSec, fontStyle: 'italic' }}>Consultar precio</span>
        <button onClick={() => onAsk(item)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 20, background: T.glass,
          border: `1px solid ${T.border}`, color: T.gold, fontSize: 12,
          cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = T.goldDim; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.glass; }}
        >💬 Preguntar</button>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────
export default function Home() {
  const [splash, setSplash] = useState(true);
  const [activeCat, setActiveCat] = useState('hamburguesas');
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenRef = useRef(false);
  const tts = useTTS();
  const {
    messages, isTyping, send, init, listening,
    autoConversation, toggleAutoConversation, startListeningRef, stopListening, cancelPendingRequest,
  } = useChat(tts, chatOpenRef);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
    if (!chatOpen) {
      stopListening();
      tts.stop();
      cancelPendingRequest();
    }
  }, [cancelPendingRequest, chatOpen, stopListening, tts]);

  const openChat = useCallback(() => { init(); setChatOpen(true); }, [init]);
  const askAbout = useCallback((item) => {
    init(); setChatOpen(true);
    setTimeout(() => send('Cuéntame más sobre ' + item.name), 400);
  }, [init, send]);

  const cat = MENU[activeCat];
  if (splash) return <Splash onEnter={() => setSplash(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <header style={{ padding: '20px 20px 0', position: 'sticky', top: 0, zIndex: 100, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.gold, fontWeight: 700, letterSpacing: 2 }}>SORBO</h1>
            <p style={{ fontSize: 10, color: T.textSec, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>Café • Bistró</p>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50' }} />
            <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 500 }}>Abierto</span>
          </div>
        </div>

        <div onClick={openChat} style={{
          background: `linear-gradient(135deg, ${T.gold}15, ${T.amber}10)`,
          border: `1px solid ${T.border}`, borderRadius: 16, padding: 16,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>¿Necesitas ayuda para elegir?</p>
            <p style={{ fontSize: 11, color: T.textSec, marginTop: 4 }}>Asistente con voz IA • Habla o escribe</p>
          </div>
          <div style={{
            padding: '8px 16px', borderRadius: 20,
            background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`,
            color: T.bg, fontSize: 12, fontWeight: 600,
          }}>Hablar</div>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
          {CATEGORIES.map(key => (
            <button key={key} onClick={() => setActiveCat(key)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 50, border: 'none',
              background: activeCat === key ? `linear-gradient(135deg, ${T.gold}, ${T.amber})` : T.elevated,
              color: activeCat === key ? T.bg : T.textSec,
              fontSize: 13, fontWeight: activeCat === key ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.3s',
              boxShadow: activeCat === key ? `0 4px 20px ${T.goldDim}` : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{MENU[key].icon}</span>
              {MENU[key].name}
            </button>
          ))}
        </div>
      </header>

      <main style={{ padding: '0 20px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, marginTop: 8 }}>
          <span style={{ fontSize: 28 }}>{cat.icon}</span>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{cat.name}</h2>
            {cat.subtitle && <p style={{ fontSize: 12, color: T.gold, marginTop: 2, fontWeight: 500 }}>{cat.subtitle}</p>}
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: T.textSec, background: T.elevated, padding: '4px 12px', borderRadius: 20 }}>{cat.items.length} items</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cat.items.map((item, i) => <Card key={item.id} item={item} idx={i} onAsk={askAbout} />)}
        </div>

        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: T.glass, border: `1px solid ${T.border}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>📍 CC Las Auroras, frente a la Plaza Bolívar</p>
          <p style={{ fontSize: 11, color: T.textSec, marginTop: 4, opacity: 0.6 }}>Todos los platos incluyen servicio de papas donde se indica</p>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center', paddingBottom: 20 }}>
          <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${T.gold}40, transparent)`, margin: '0 auto 16px' }} />
          <p style={{ fontSize: 10, color: T.textSec, opacity: 0.4 }}>Experiencia digital por OpenSyntheAI</p>
          <p style={{ fontSize: 9, color: T.textSec, opacity: 0.3, marginTop: 4 }}>NFC + IA • El futuro de la gastronomía digital</p>
        </div>
      </main>

      <button onClick={openChat} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 5000,
        width: 60, height: 60, borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`,
        border: 'none', cursor: 'pointer', fontSize: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 32px ${T.gold}50`, animation: 'float-btn 3s ease-in-out infinite',
      }}>💬</button>

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={send}
        isTyping={isTyping}
        tts={tts}
        listening={listening}
        startListeningRef={startListeningRef}
        onStopListening={stopListening}
        autoConversation={autoConversation}
        onToggleAutoConversation={toggleAutoConversation}
      />
      <style jsx global>{`
        @keyframes voice-wave {
          0%, 100% { transform: scaleY(0.45); opacity: 0.35; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
