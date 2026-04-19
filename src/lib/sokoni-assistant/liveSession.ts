// Live recognition manager: keeps mic on, detects pauses smartly.
// - Resets a 4s silence timer on every speech event.
// - Treats utterances ending in filler/connector words as "still talking".
// - Pauses while assistant is speaking, auto-resumes when speaking ends.

import {
  createRecognizer,
  type SpeechRecognitionLike,
} from "./speech";
import { looksIncomplete, stripFillers } from "./dbSearch";

export type LiveCallbacks = {
  onPartial: (text: string) => void;
  onFinal: (text: string) => void;
  onListeningChange: (listening: boolean) => void;
  onError?: (err: string) => void;
};

const SILENCE_MS = 4000;       // wait this long after last speech before finalising
const MIN_FINAL_LEN = 2;       // ignore single noise tokens

export class LiveSpeechSession {
  private rec: SpeechRecognitionLike | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;
  private buffer = "";
  private interim = "";
  private active = false;
  private paused = false;       // paused while assistant talks
  private restartLock = false;
  private cb: LiveCallbacks;

  constructor(cb: LiveCallbacks) {
    this.cb = cb;
  }

  start() {
    if (this.active) return;
    const rec = createRecognizer("en-US");
    if (!rec) {
      this.cb.onError?.("Speech recognition not supported in this browser.");
      return;
    }
    this.rec = rec;
    this.active = true;
    this.bind();
    try { rec.start(); } catch { /* ignore */ }
  }

  stop() {
    this.active = false;
    this.clearSilence();
    if (this.rec) {
      try { this.rec.stop(); } catch { /* ignore */ }
      this.rec.onresult = null;
      this.rec.onerror = null;
      this.rec.onend = null;
      this.rec.onstart = null;
      this.rec = null;
    }
    this.buffer = "";
    this.interim = "";
    this.cb.onListeningChange(false);
  }

  // Pause while assistant speaks to avoid feedback
  pauseForSpeaking() {
    this.paused = true;
    if (this.rec) {
      try { this.rec.stop(); } catch { /* ignore */ }
    }
  }

  resumeAfterSpeaking() {
    this.paused = false;
    if (this.active) {
      this.restart();
    }
  }

  private bind() {
    if (!this.rec) return;
    this.rec.onstart = () => this.cb.onListeningChange(true);
    this.rec.onerror = (e: any) => {
      const err = e?.error || "unknown";
      if (err !== "no-speech" && err !== "aborted" && err !== "audio-capture") {
        this.cb.onError?.(err);
      }
    };
    this.rec.onend = () => {
      this.cb.onListeningChange(false);
      // Auto-restart while session is active and not paused.
      if (this.active && !this.paused) {
        this.restart();
      }
    };
    this.rec.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += transcript + " ";
        else interim += transcript + " ";
      }
      if (final) {
        this.buffer = (this.buffer + " " + final).replace(/\s+/g, " ").trim();
      }
      this.interim = interim.trim();
      this.cb.onPartial((this.buffer + " " + this.interim).trim());
      this.scheduleSilenceCheck();
    };
  }

  private restart() {
    if (this.restartLock) return;
    this.restartLock = true;
    setTimeout(() => {
      this.restartLock = false;
      if (!this.active || this.paused) return;
      const rec = createRecognizer("en-US");
      if (!rec) return;
      this.rec = rec;
      this.bind();
      try { rec.start(); } catch { /* already started */ }
    }, 250);
  }

  private clearSilence() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private scheduleSilenceCheck() {
    this.clearSilence();
    this.silenceTimer = setTimeout(() => this.maybeFinalise(), SILENCE_MS);
  }

  private maybeFinalise() {
    const combined = (this.buffer + " " + this.interim).trim();
    if (combined.length < MIN_FINAL_LEN) return;

    const cleaned = stripFillers(combined);

    // If utterance still feels incomplete (ends in connector/filler), give them more time.
    if (looksIncomplete(cleaned)) {
      this.scheduleSilenceCheck();
      return;
    }

    // Lock & emit
    this.buffer = "";
    this.interim = "";
    this.cb.onFinal(cleaned);
  }
}
