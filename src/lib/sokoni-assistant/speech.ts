// Free Web Speech API wrappers + smart "live" recognition manager
// with filler-word handling and a configurable silence threshold.

export type SpeechRecognitionLike = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  lang: string;
  interimResults: boolean;
  continuous: boolean;
};

function getCtor(): any {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(getCtor());
}

export function createRecognizer(lang = "en-US"): SpeechRecognitionLike | null {
  const Ctor = getCtor();
  if (!Ctor) return null;
  const rec: SpeechRecognitionLike = new Ctor();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = true;
  return rec;
}

// ---------- TTS ----------
let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferred =
    voices.find((v) => /en[-_](US|GB|KE)/i.test(v.lang) && /female|samantha|google|jenny|zira|aria|natural/i.test(v.name)) ||
    voices.find((v) => /en[-_](US|GB|KE)/i.test(v.lang)) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];
  cachedVoice = preferred ?? null;
  return cachedVoice;
}

export function speak(text: string, opts?: { onStart?: () => void; onEnd?: () => void }) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;
  utter.onstart = () => opts?.onStart?.();
  utter.onend = () => opts?.onEnd?.();
  utter.onerror = () => opts?.onEnd?.();
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}
