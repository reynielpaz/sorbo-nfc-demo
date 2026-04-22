import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text || !process.env.OPENAI_API_KEY) {
      return new Response('Missing text or API key', { status: 400 });
    }
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: cleanText,
      speed: 1.05,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return new Response(buffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length.toString() },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response('TTS failed', { status: 500 });
  }
}
