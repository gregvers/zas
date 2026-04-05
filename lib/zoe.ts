// In-memory cache: text → object URL, so same phrase isn't re-fetched
const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;
let currentController: AbortController | null = null;

// Call this on the first user gesture to unlock Chrome's autoplay policy
let audioUnlocked = false;
export function unlockAudio() {
  if (audioUnlocked || typeof window === "undefined") return;
  audioUnlocked = true;
  try {
    const ctx = new AudioContext();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    ctx.close();
  } catch {
    // ignore
  }
}

function zoeSpeakBrowser(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.pitch = 1.15;
  u.rate = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.name.toLowerCase().includes("samantha")) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
}

export async function zoeSpeak(text: string, premium = false): Promise<void> {
  if (typeof window === "undefined") return;

  // Abort any in-flight fetch and stop whatever is currently playing
  if (currentController) {
    currentController.abort();
    currentController = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  // Non-premium: use browser TTS directly, no ElevenLabs call
  if (!premium) {
    zoeSpeakBrowser(text);
    return;
  }

  const controller = new AbortController();
  currentController = controller;

  try {
    let url = audioCache.get(text);

    if (!url) {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("ElevenLabs API failed");

      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      audioCache.set(text, url);
    }

    // If aborted while fetching, bail out
    if (controller.signal.aborted) return;

    currentController = null;
    currentAudio = new Audio(url);
    await currentAudio.play();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") return;
    zoeSpeakBrowser(text);
  }
}

export function zoeStop() {
  if (currentController) {
    currentController.abort();
    currentController = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
}
