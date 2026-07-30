/**
 * Text-to-speech utility for Filipino/Tagalog.
 * Uses the browser's built-in Web Speech API.
 */

export function speak(text: string, lang: string = "fil-PH") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.1; // Slightly higher pitch for friendliness

  // Try to find a Filipino voice, fall back to default
  const voices = window.speechSynthesis.getVoices();
  const filipinoVoice = voices.find(
    (v) =>
      v.lang.startsWith("fil") ||
      v.lang.startsWith("tl") ||
      v.name.toLowerCase().includes("filipino") ||
      v.name.toLowerCase().includes("tagalog")
  );

  if (filipinoVoice) {
    utterance.voice = filipinoVoice;
  } else {
    // Fallback: try any Southeast Asian language or just use default
    utterance.lang = "en-PH"; // English Philippines accent as fallback
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
