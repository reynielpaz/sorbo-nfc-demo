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
// Legacy greeting kept for reference
const GREETING = 'Hola! Bienvenido a Sorbo Café Bistró. Soy tu asistente personal. Puedo ayudarte a elegir del menú, contarte sobre cualquier plato, o armar tu pedido. Qué se te antoja hoy?';
const REALTIME_MIC_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};
const REALTIME_IDLE_TIMEOUT_MS = 20000;
const REALTIME_AUTO_CLOSE_AFTER_AUDIO_MS = 350;
const REALTIME_FINAL_SUMMARY_CLOSE_MS = 6000;

// ─── LEGACY: TTS HOOK (kept, not used in main flow) ──────────
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
      audio.onended = () => { cleanupAudio(audio, url); if (onDone) onDone(); };
      audio.onerror = () => { cleanupAudio(audio, url); };
      await audio.play();
    } catch { cleanupAudio(); }
  }, [cleanupAudio, voiceEnabled]);

  useEffect(() => () => cleanupAudio(), [cleanupAudio]);

  const stop = useCallback(() => { cleanupAudio(); }, [cleanupAudio]);
  const toggle = useCallback(() => {
    if (isSpeaking) cleanupAudio();
    setVoiceEnabled(v => !v);
  }, [cleanupAudio, isSpeaking]);

  return { speak, stop, toggle, isSpeaking, voiceEnabled };
}

// ─── LEGACY: CHAT HOOK (kept, not used in main flow) ─────────
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
    if (controller) { try { controller.abort(); } catch {} }
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
      const apiMessages = nextMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));
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
    recognition.onerror = () => { if (recognitionRef.current === recognition) recognitionRef.current = null; setListening(false); };
    recognition.onend = () => { if (recognitionRef.current === recognition) recognitionRef.current = null; setListening(false); };
    try { recognition.start(); } catch { recognitionRef.current = null; setListening(false); }
  }, [isTyping, listening, send, stopListening, tts]);

  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);
  useEffect(() => () => cancelPendingRequest(), [cancelPendingRequest]);

  const toggleAutoConversation = useCallback(() => { setAutoConversation(v => !v); }, []);

  return { messages, isTyping, send, init, listening, autoConversation, toggleAutoConversation, startListeningRef, stopListening, cancelPendingRequest };
}

// ─── REALTIME VOICE HOOK ──────────────────────────────────────
function useRealtimeVoice() {
  const [status, setStatus] = useState('idle'); // idle | connecting | listening | speaking | error
  const [errorMsg, setErrorMsg] = useState('');
  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const audioElRef = useRef(null);
  const streamRef = useRef(null);
  const startingRef = useRef(false);
  const micMutedRef = useRef(false);
  const assistantSpeakingRef = useRef(false);
  const micRestoreTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const autoCloseTimerRef = useRef(null);
  const sessionTokenRef = useRef(0);
  const closingReasonRef = useRef('');
  const pendingCloseReasonRef = useRef('');
  const pendingSummaryCloseRef = useRef(false);

  const clearMicRestoreTimer = useCallback(() => {
    if (micRestoreTimerRef.current) {
      clearTimeout(micRestoreTimerRef.current);
      micRestoreTimerRef.current = null;
    }
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const isCurrentSessionToken = useCallback((token) => token === sessionTokenRef.current, []);

  const disposeSessionArtifacts = useCallback((pc, dc, stream, audioEl) => {
    if (dc) { try { dc.close(); } catch {} }
    if (pc) { try { pc.close(); } catch {} }
    if (stream) { try { stream.getTracks().forEach(t => t.stop()); } catch {} }
    if (audioEl) {
      try { audioEl.pause(); audioEl.srcObject = null; } catch {}
    }
  }, []);

  const normalizeRealtimeText = useCallback((value = '') => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim(), []);

  const isFinalIntentTranscript = useCallback((value = '') => {
    const normalized = normalizeRealtimeText(value);
    if (!normalized) return false;
    const finalIntentPhrases = [
      'solamente eso',
      'solo eso',
      'eso seria todo',
      'eso es todo',
      'nada mas',
      'mas nada',
      'ya solamente eso',
      'ok solamente eso',
      'ya termine',
    ];
    if (finalIntentPhrases.some((phrase) => normalized.includes(phrase))) {
      return true;
    }
    return ['gracias', 'muchas gracias', 'listo', 'ok listo', 'bueno listo', 'dale listo'].includes(normalized);
  }, [normalizeRealtimeText]);

  const isFinalOrderSummaryTranscript = useCallback((value = '') => {
    const normalized = normalizeRealtimeText(value);
    if (!normalized) return false;

    const directPatterns = [
      /tu (pedido|orden) (queda|quedo|quedaria|seria|incluye|esta|estaria)/,
      /(pedido|orden) (confirmado|confirmada|anotado|anotada)/,
      /queda asi tu (pedido|orden)/,
      /resumen de tu (pedido|orden)/,
    ];

    if (directPatterns.some((pattern) => pattern.test(normalized))) {
      return true;
    }

    const hasOrderTerm = /(pedido|orden)/.test(normalized);
    const hasSummaryTerm = /(queda|quedo|quedaria|seria|incluye|confirmad|anotad|listo)/.test(normalized);
    return hasOrderTerm && hasSummaryTerm;
  }, [normalizeRealtimeText]);

  const logRealtimeEvent = useCallback((type, details) => {
    if (details === undefined) {
      console.log(`[realtime] ${type}`);
      return;
    }
    console.log(`[realtime] ${type}`, details);
  }, []);

  const setMicMuted = useCallback((muted, reason) => {
    const stream = streamRef.current;
    if (!stream) return;

    const tracks = stream.getAudioTracks();
    if (!tracks.length) return;

    tracks.forEach((track) => {
      track.enabled = !muted;
    });

    micMutedRef.current = muted;
    console.log(`[realtime] mic.${muted ? 'muted' : 'unmuted'} (${reason})`);
  }, []);

  const cleanup = useCallback(() => {
    sessionTokenRef.current += 1;
    startingRef.current = false;
    clearMicRestoreTimer();
    clearIdleTimer();
    clearAutoCloseTimer();
    assistantSpeakingRef.current = false;
    micMutedRef.current = false;
    pendingCloseReasonRef.current = '';
    pendingSummaryCloseRef.current = false;
    if (dcRef.current) { try { dcRef.current.close(); } catch {} dcRef.current = null; }
    if (pcRef.current) { try { pcRef.current.close(); } catch {} pcRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioElRef.current) {
      try { audioElRef.current.pause(); audioElRef.current.srcObject = null; } catch {}
      audioElRef.current = null;
    }
  }, [clearAutoCloseTimer, clearIdleTimer, clearMicRestoreTimer]);

  const stopSession = useCallback((reason = 'manual stop') => {
    closingReasonRef.current = reason;
    console.log(`[realtime] session.close (${reason})`);
    cleanup();
    setStatus('idle');
    setErrorMsg('');
  }, [cleanup]);

  const scheduleIdleTimeout = useCallback((source = 'activity') => {
    clearIdleTimer();
    if (!pcRef.current && !startingRef.current) return;

    idleTimerRef.current = setTimeout(() => {
      if (assistantSpeakingRef.current) {
        console.log('[realtime] idle timeout deferred while assistant is speaking');
        scheduleIdleTimeout('assistant-speaking');
        return;
      }
      stopSession('idle timeout');
    }, REALTIME_IDLE_TIMEOUT_MS);

    console.log(`[realtime] idle.timeout.reset (${source})`);
  }, [clearIdleTimer, stopSession]);

  const scheduleSessionClose = useCallback((reason, delayMs) => {
    clearAutoCloseTimer();
    clearIdleTimer();
    console.log(`[realtime] session.close.scheduled (${reason}, ${delayMs}ms)`);
    autoCloseTimerRef.current = setTimeout(() => {
      stopSession(reason);
    }, delayMs);
  }, [clearAutoCloseTimer, clearIdleTimer, stopSession]);

  const muteMicForAssistant = useCallback((reason) => {
    clearMicRestoreTimer();
    assistantSpeakingRef.current = true;
    if (!micMutedRef.current) {
      setMicMuted(true, reason);
    }
  }, [clearMicRestoreTimer, setMicMuted]);

  const restoreMicAfterAssistant = useCallback((reason) => {
    clearMicRestoreTimer();
    assistantSpeakingRef.current = false;
    if (micMutedRef.current) {
      setMicMuted(false, reason);
    }
    if (pcRef.current) {
      setStatus('listening');
    }
  }, [clearMicRestoreTimer, setMicMuted]);

  const scheduleMicRestore = useCallback((reason, delayMs = 320) => {
    clearMicRestoreTimer();
    console.log(`[realtime] mic.unmute.scheduled (${reason}, ${delayMs}ms)`);
    micRestoreTimerRef.current = setTimeout(() => {
      restoreMicAfterAssistant(reason);
    }, delayMs);
  }, [clearMicRestoreTimer, restoreMicAfterAssistant]);

  const stop = useCallback(() => {
    stopSession('manual stop');
  }, [stopSession]);

  const createClientSecret = useCallback(async () => {
    const sessionRes = await fetch('/api/session', {
      method: 'POST',
      cache: 'no-store',
    });

    let session = null;
    try {
      session = await sessionRes.json();
    } catch {}

    if (!sessionRes.ok) throw new Error(session?.error || 'No se pudo crear la sesión de voz');
    if (session?.error) throw new Error(session.error);
    if (!session?.value) throw new Error('Token de sesión inválido');

    return session.value;
  }, []);

  const start = useCallback(async () => {
    if (startingRef.current || pcRef.current) return;
    const sessionToken = sessionTokenRef.current + 1;
    sessionTokenRef.current = sessionToken;
    startingRef.current = true;
    closingReasonRef.current = '';
    pendingCloseReasonRef.current = '';
    pendingSummaryCloseRef.current = false;
    clearAutoCloseTimer();
    clearIdleTimer();
    setStatus('connecting');
    setErrorMsg('');

    try {
      const isSessionActive = () => isCurrentSessionToken(sessionToken) && !closingReasonRef.current;

      // 1. Request microphone before minting a short-lived client secret.
      const stream = await navigator.mediaDevices.getUserMedia(REALTIME_MIC_CONSTRAINTS);
      if (!isSessionActive()) {
        disposeSessionArtifacts(null, null, stream, null);
        return;
      }
      streamRef.current = stream;

      // 2. Set up WebRTC peer connection.
      const pc = new RTCPeerConnection();
      if (!isSessionActive()) {
        disposeSessionArtifacts(pc, null, stream, null);
        return;
      }
      pcRef.current = pc;

      // 3. Remote audio element for model output.
      const audioEl = new Audio();
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        if (!isSessionActive()) return;
        if (e.track.kind === 'audio' && audioElRef.current) {
          if (audioElRef.current.srcObject !== e.streams[0]) {
            audioElRef.current.srcObject = e.streams[0];
          }
          if (audioElRef.current.paused) {
            audioElRef.current.play().catch(() => {});
          }
        }
      };

      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      // 4. Data channel for events and state.
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.addEventListener('open', () => {
        if (!isSessionActive()) return;
        startingRef.current = false;
        setStatus('listening');
        scheduleIdleTimeout('datachannel.open');
      });

      dc.addEventListener('message', (e) => {
        if (!isSessionActive()) return;
        try {
          const evt = JSON.parse(e.data);
          switch (evt.type) {
            case 'session.created':
              logRealtimeEvent('session.created', evt);
              setStatus('listening');
              scheduleIdleTimeout('session.created');
              break;
            case 'session.updated':
              if (!assistantSpeakingRef.current) {
                setStatus('listening');
              }
              break;
            case 'input_audio_buffer.speech_started':
              logRealtimeEvent('input_audio_buffer.speech_started', evt);
              if (assistantSpeakingRef.current) {
                console.log('[realtime] input_audio_buffer.speech_started ignored while assistant is speaking');
                break;
              }
              clearAutoCloseTimer();
              pendingSummaryCloseRef.current = false;
              setStatus('listening');
              scheduleIdleTimeout('input_audio_buffer.speech_started');
              break;
            case 'conversation.item.input_audio_transcription.completed':
              logRealtimeEvent('conversation.item.input_audio_transcription.completed', evt);
              if (evt.transcript) {
                const finalIntent = isFinalIntentTranscript(evt.transcript);
                pendingCloseReasonRef.current = finalIntent ? 'user final intent' : '';
                pendingSummaryCloseRef.current = false;
                clearAutoCloseTimer();
                console.log('[realtime] user.transcript', {
                  transcript: evt.transcript,
                  final_intent: finalIntent,
                });
                scheduleIdleTimeout('user.transcript');
              }
              break;
            case 'response.created':
              logRealtimeEvent('response.created', evt);
              clearAutoCloseTimer();
              pendingSummaryCloseRef.current = false;
              muteMicForAssistant('response.created');
              setStatus('speaking');
              scheduleIdleTimeout('response.created');
              break;
            case 'response.output_audio.delta':
            case 'response.audio.delta':
              logRealtimeEvent('response.audio.delta', { responseId: evt.response_id });
              muteMicForAssistant('response.audio.delta');
              setStatus('speaking');
              break;
            case 'response.output_audio.done':
            case 'response.audio.done':
              logRealtimeEvent('response.audio.done', evt);
              break;
            case 'response.output_audio_transcript.done':
            case 'response.audio_transcript.done':
              logRealtimeEvent(evt.type, evt);
              if (evt.transcript) {
                const finalSummary = isFinalOrderSummaryTranscript(evt.transcript);
                if (finalSummary && !pendingCloseReasonRef.current) {
                  pendingSummaryCloseRef.current = true;
                }
                console.log('[realtime] assistant.transcript', {
                  transcript: evt.transcript,
                  final_order_summary: finalSummary,
                });
              }
              break;
            case 'response.done':
              logRealtimeEvent('response.done', evt);
              {
                const response = evt.response || {};
                const usage = response.usage || evt.usage || null;
                const status = response.status || evt.status || null;
                const statusDetails = response.status_details || evt.status_details || null;
                const reason =
                  statusDetails?.reason ||
                  statusDetails?.type ||
                  response.reason ||
                  evt.reason ||
                  null;
                const outputTokens =
                  usage?.output_tokens ??
                  usage?.total_output_tokens ??
                  usage?.output_token_count ??
                  null;
                const truncation =
                  response.truncation ??
                  evt.truncation ??
                  statusDetails?.truncation ??
                  null;
                const incomplete =
                  response.incomplete_details ??
                  evt.incomplete_details ??
                  statusDetails?.incomplete_details ??
                  null;

                console.log('[realtime] response.done.summary', {
                  status,
                  status_details: statusDetails,
                  reason,
                  usage,
                  output_tokens: outputTokens,
                  truncation,
                  incomplete,
                  finish_reason: response.finish_reason || evt.finish_reason || null,
                });
              }
              break;
            case 'output_audio_buffer.stopped':
              logRealtimeEvent('output_audio_buffer.stopped', evt);
              scheduleMicRestore('output_audio_buffer.stopped', 320);
              if (pendingCloseReasonRef.current === 'user final intent') {
                const closeReason = pendingCloseReasonRef.current;
                pendingCloseReasonRef.current = '';
                pendingSummaryCloseRef.current = false;
                scheduleSessionClose(closeReason, REALTIME_AUTO_CLOSE_AFTER_AUDIO_MS);
                break;
              }
              if (pendingSummaryCloseRef.current) {
                pendingSummaryCloseRef.current = false;
                scheduleSessionClose('final order summary', REALTIME_FINAL_SUMMARY_CLOSE_MS);
                break;
              }
              scheduleIdleTimeout('output_audio_buffer.stopped');
              break;
            case 'error':
              logRealtimeEvent('error', evt.error);
              console.error('Realtime error event:', evt.error);
              clearAutoCloseTimer();
              clearIdleTimer();
              restoreMicAfterAssistant('error');
              setErrorMsg(evt.error?.message || 'Error en la sesión');
              setStatus('error');
              break;
          }
        } catch {}
      });

      dc.addEventListener('error', () => {
        if (!isSessionActive()) return;
        if (closingReasonRef.current) return;
        restoreMicAfterAssistant('datachannel.error');
        setErrorMsg('Error en el canal de datos');
        setStatus('error');
      });

      pc.onconnectionstatechange = () => {
        if (!isSessionActive()) return;
        if (pc.connectionState === 'closed' && closingReasonRef.current) {
          console.log(`[realtime] pc.closed (${closingReasonRef.current})`);
          return;
        }
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          setErrorMsg('Conexión WebRTC perdida');
          setStatus('error');
          cleanup();
        }
      };

      // 5. Prepare the offer first, then mint the client secret right before the SDP POST.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (!offer.sdp) {
        throw new Error('No se pudo preparar la oferta WebRTC');
      }

      let answerSdp = '';
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const ephemeralKey = await createClientSecret();
        if (!isSessionActive()) {
          disposeSessionArtifacts(pc, dc, stream, audioEl);
          return;
        }
        const sdpRes = await fetch('https://api.openai.com/v1/realtime/calls', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        });

        if (sdpRes.ok) {
          answerSdp = await sdpRes.text();
          break;
        }

        const errBody = await sdpRes.text();
        const tokenExpired = sdpRes.status === 401 && /expired/i.test(errBody);
        if (!tokenExpired || attempt === 1) {
          throw new Error(`WebRTC handshake error ${sdpRes.status}: ${errBody.slice(0, 120)}`);
        }
      }

      if (!answerSdp) {
        throw new Error('No se pudo completar el handshake WebRTC');
      }

      // 6. Set remote description with OpenAI's SDP answer.
      if (!isSessionActive()) {
        disposeSessionArtifacts(pc, dc, stream, audioEl);
        return;
      }
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

    } catch (err) {
      if (!isCurrentSessionToken(sessionToken)) {
        return;
      }
      console.error('Realtime voice error:', err);
      setErrorMsg(err.message || 'No se pudo conectar');
      setStatus('error');
      cleanup();
    }
  }, [
    cleanup,
    clearAutoCloseTimer,
    clearIdleTimer,
    createClientSecret,
    disposeSessionArtifacts,
    isCurrentSessionToken,
    isFinalIntentTranscript,
    isFinalOrderSummaryTranscript,
    logRealtimeEvent,
    muteMicForAssistant,
    restoreMicAfterAssistant,
    scheduleIdleTimeout,
    scheduleMicRestore,
    scheduleSessionClose,
  ]);

  useEffect(() => () => cleanup(), [cleanup]);

  return { status, errorMsg, start, stop };
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

// ─── VOICE ORB ────────────────────────────────────────────────
function VoiceOrb({ status, onStart, onStop }) {
  const active = status === 'connecting' || status === 'listening' || status === 'speaking';

  const orbAnimation = {
    idle: 'orb-breathe 3s ease-in-out infinite',
    connecting: 'orb-breathe 1.5s ease-in-out infinite',
    listening: 'orb-pulse 1.6s ease-in-out infinite',
    speaking: 'orb-pulse-strong 0.85s ease-in-out infinite',
    error: 'orb-shake 0.5s ease',
  }[status];

  const orbGradient = {
    idle: `radial-gradient(circle at 35% 30%, ${T.gold}, #5c3d00)`,
    connecting: `radial-gradient(circle at 35% 30%, ${T.gold}cc, #7a5200)`,
    listening: `radial-gradient(circle at 35% 30%, ${T.gold}, #6e4800)`,
    speaking: `radial-gradient(circle at 35% 30%, ${T.amber}, #7a4010)`,
    error: 'radial-gradient(circle at 35% 30%, #dc4040, #6b1010)',
  }[status];

  const orbShadow = {
    idle: `0 0 40px ${T.gold}35, 0 0 80px ${T.gold}12`,
    connecting: `0 0 50px ${T.gold}55, 0 0 100px ${T.gold}20`,
    listening: `0 0 55px ${T.gold}65, 0 0 110px ${T.gold}25`,
    speaking: `0 0 65px ${T.amber}75, 0 0 130px ${T.amber}30`,
    error: '0 0 40px rgba(220,50,50,0.55), 0 0 80px rgba(220,50,50,0.2)',
  }[status];

  const statusLabel = {
    idle: 'Toca para hablar',
    connecting: 'Conectando...',
    listening: 'Escuchando...',
    speaking: 'Respondiendo...',
    error: 'Error · Toca para reintentar',
  }[status];

  const statusColor = {
    idle: T.textSec,
    connecting: T.gold,
    listening: T.gold,
    speaking: T.amber,
    error: '#ff6b6b',
  }[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, userSelect: 'none' }}>

      {/* Orb wrapper */}
      <div
        style={{ position: 'relative', width: 160, height: 160, cursor: 'pointer' }}
        onClick={active ? onStop : onStart}
        role="button"
        aria-label={active ? 'Detener asistente de voz' : 'Iniciar asistente de voz'}
      >
        {/* Ambient glow behind orb */}
        <div style={{
          position: 'absolute', inset: -28, borderRadius: '50%',
          background: status === 'error'
            ? 'radial-gradient(circle, rgba(220,50,50,0.10), transparent 65%)'
            : `radial-gradient(circle, ${T.gold}10, transparent 65%)`,
          animation: active ? 'orb-breathe 2.5s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }} />

        {/* Connecting: spinning dashed ring */}
        {status === 'connecting' && (
          <div style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: T.gold,
            borderRightColor: `${T.gold}30`,
            animation: 'orb-spin-ring 1s linear infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Listening: expanding wave rings */}
        {status === 'listening' && [0, 0.6, 1.2].map((delay, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1px solid ${T.gold}45`,
            animation: `orb-ring 2s ease-out ${delay}s infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Orb body */}
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: orbGradient,
          boxShadow: `${orbShadow}, inset 0 0 40px rgba(0,0,0,0.4)`,
          animation: orbAnimation,
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glass highlight for 3D effect */}
          <div style={{
            position: 'absolute', top: '16%', left: '22%',
            width: '38%', height: '28%', borderRadius: '50%',
            background: 'rgba(255,255,255,0.16)', filter: 'blur(8px)',
            pointerEvents: 'none',
          }} />
          <svg
            width="62"
            height="62"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
          >
            <path d="M20 28H41C41 38.4934 35.8513 46 30.5 46C25.1487 46 20 38.4934 20 28Z" stroke="rgba(247,235,213,0.96)" strokeWidth="3" strokeLinejoin="round" />
            <path d="M41 30H45.5C49.6421 30 53 33.3579 53 37.5C53 41.6421 49.6421 45 45.5 45H42" stroke="rgba(247,235,213,0.96)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 50H47" stroke="rgba(247,235,213,0.96)" strokeWidth="3" strokeLinecap="round" />
            <path d="M24 15C24 18 21.5 19.5 21.5 22.5C21.5 24.5 22.5 25.8 24 27" stroke="rgba(247,235,213,0.88)" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M31 12C31 15.5 28.5 17.2 28.5 20.4C28.5 22.5 29.6 24.2 31 25.6" stroke="rgba(247,235,213,0.94)" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M38 15C38 18 35.5 19.4 35.5 22.1C35.5 24.1 36.5 25.5 38 26.9" stroke="rgba(247,235,213,0.8)" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Speaking: voice bars below orb */}
        {status === 'speaking' && (
          <div style={{
            position: 'absolute', bottom: -38, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'flex-end', gap: 4, height: 28,
            pointerEvents: 'none',
          }}>
            {[0, 0.08, 0.16, 0.24, 0.32, 0.24, 0.16, 0.08, 0].map((delay, i) => (
              <div key={i} style={{
                width: 4, height: 28, borderRadius: 999,
                background: `linear-gradient(180deg, ${T.amber}, ${T.gold})`,
                transformOrigin: 'bottom center',
                animation: `voice-wave 0.75s ease-in-out ${delay}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Status text */}
      <p style={{
        marginTop: status === 'speaking' ? 56 : 24,
        fontSize: 13, color: statusColor,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500, letterSpacing: 0.5,
        transition: 'color 0.3s, margin-top 0.3s',
        textAlign: 'center',
      }}>{statusLabel}</p>

      {/* Explicit stop button when active */}
      {active && (
        <button onClick={(e) => { e.stopPropagation(); onStop(); }} style={{
          marginTop: 16, padding: '9px 28px', borderRadius: 24,
          border: `1px solid ${T.border}`, background: T.elevated,
          color: T.textSec, fontSize: 11, fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer', letterSpacing: 1.5, textTransform: 'uppercase',
          fontWeight: 500, transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}
        >Detener</button>
      )}
    </div>
  );
}

// ─── LEGACY: CHAT PANEL (kept, not rendered in main flow) ─────
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
            <button onClick={onToggleAutoConversation} style={{
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeSlideUp 0.3s ease both' }}>
              <div style={{ maxWidth: '82%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? `linear-gradient(135deg, ${T.gold}, ${T.amber})` : T.card,
                  color: m.role === 'user' ? T.bg : T.text,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6,
                  border: m.role === 'user' ? 'none' : `1px solid ${T.border}`,
                }}>{m.text}</div>
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

        <div style={{ padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
          {quickActions.map(q => (
            <button key={q} onClick={() => { if (isTyping) return; onSend(q); }} style={{
              padding: '8px 16px', borderRadius: 20, border: `1px solid ${T.border}`,
              background: T.glass, color: T.textSec, fontSize: 12,
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s',
            }}>{q}</button>
          ))}
        </div>

        <div style={{
          padding: '12px 16px 24px', display: 'flex', gap: 10, alignItems: 'center',
          borderTop: `1px solid ${T.border}`, background: T.card,
        }}>
          <button onClick={handleVoice} style={{
            minWidth: listening ? 84 : 42, height: 42, padding: listening ? '0 12px' : 0,
            borderRadius: listening ? 12 : '50%', border: 'none',
            background: listening ? '#D84C4C' : T.elevated, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: listening ? 11 : 18, flexShrink: 0, color: listening ? '#FFF5F5' : T.textSec,
            fontWeight: listening ? 700 : 400,
          }}>{listening ? 'Detener' : '🎤'}</button>
          <input ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Escribe o usa el micrófono..."
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
        {onAsk && (
          <button onClick={() => onAsk(item)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20, background: T.glass,
            border: `1px solid ${T.border}`, color: T.gold, fontSize: 12,
            cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.goldDim; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.glass; }}
          >🎙 Preguntar</button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────
export default function Home() {
  const [splash, setSplash] = useState(true);
  const [activeCat, setActiveCat] = useState('hamburguesas');
  const { status, errorMsg, start, stop } = useRealtimeVoice();

  // Clicking "Preguntar" on a card starts the voice session
  const askAbout = useCallback(() => {
    if (status === 'idle' || status === 'error') start();
  }, [start, status]);

  const cat = MENU[activeCat];
  if (splash) return <Splash onEnter={() => setSplash(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, maxWidth: 480, margin: '0 auto', position: 'relative' }}>

      {/* Header */}
      <header style={{ padding: '20px 20px 0', position: 'sticky', top: 0, zIndex: 100, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.gold, fontWeight: 700, letterSpacing: 2 }}>SORBO</h1>
            <p style={{ fontSize: 10, color: T.textSec, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>Café • Bistró</p>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50' }} />
            <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 500 }}>Abierto</span>
          </div>
        </div>

        {/* Category pills */}
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

      {/* Voice Orb Hero */}
      <section style={{
        padding: '36px 20px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <p style={{ fontSize: 11, color: T.textSec, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 40 }}>
          Asistente de Voz Premium
        </p>
        <VoiceOrb status={status} onStart={start} onStop={stop} />
        {errorMsg && (
          <p style={{ fontSize: 11, color: '#ff6b6b', marginTop: 16, textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
            {errorMsg}
          </p>
        )}
        <p style={{ fontSize: 11, color: T.textSec, marginTop: 28, opacity: 0.45, textAlign: 'center' }}>
          Habla con naturalidad · Pregunta por cualquier plato
        </p>
      </section>

      {/* Menu */}
      <main style={{ padding: '20px 20px 80px' }}>
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
          <p style={{ fontSize: 9, color: T.textSec, opacity: 0.3, marginTop: 4 }}>NFC + IA · El futuro de la gastronomía digital</p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes voice-wave {
          0%, 100% { transform: scaleY(0.45); opacity: 0.35; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
