"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TrashCategory,
  FIVE_R_DATA,
  CATEGORY_EMOJI,
  VALID_CATEGORIES,
  R_COLORS,
  R_ICONS,
  FiveRRecommendation,
} from "@/lib/categories";
import { speak, stopSpeech } from "@/lib/speech";
import { getSpeechText } from "@/lib/speech-content";

interface ScanResult {
  category: TrashCategory;
  image: string;
  timestamp: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualOverride, setManualOverride] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("suri-result");
    if (!stored) {
      router.push("/scan");
      return;
    }
    const parsed: ScanResult = JSON.parse(stored);
    setResult(parsed);

    // Log to localStorage for impact stats (only log once per scan)
    const logKey = "suri-scan-logs";
    const alreadyLogged = sessionStorage.getItem("suri-result-logged");
    if (!alreadyLogged) {
      const existing = JSON.parse(localStorage.getItem(logKey) || "[]");
      existing.push({
        category: parsed.category,
        timestamp: parsed.timestamp,
      });
      localStorage.setItem(logKey, JSON.stringify(existing));
      sessionStorage.setItem("suri-result-logged", "true");
    }
  }, [router]);

  // Auto-speak on result load
  useEffect(() => {
    if (result && !sessionStorage.getItem("suri-spoken")) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        handleSpeak(result.category);
        sessionStorage.setItem("suri-spoken", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleSpeak = useCallback((category: TrashCategory) => {
    const fullText = getSpeechText(category);
    setIsSpeaking(true);
    speak(fullText);

    // Estimate speech duration
    const wordCount = fullText.split(" ").length;
    const duration = Math.max(3000, (wordCount / 2) * 1000);
    setTimeout(() => setIsSpeaking(false), duration);
  }, []);

  const handleStop = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  const handleCategoryChange = (cat: TrashCategory) => {
    if (!result) return;
    const updated = { ...result, category: cat };
    setResult(updated);
    sessionStorage.setItem("suri-result", JSON.stringify(updated));
    setManualOverride(false);
    // Speak new category
    handleSpeak(cat);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    );
  }

  const data: FiveRRecommendation = FIVE_R_DATA[result.category];
  const rKeys = ["reduce", "reuse", "recover", "recycle", "repair"] as const;

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      {/* Item identification header */}
      <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md border border-green-100">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-green-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.image}
            alt="Scanned item"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Na-detect na item</p>
          <p className="text-lg font-bold text-green-800 capitalize flex items-center gap-2">
            <span>{CATEGORY_EMOJI[result.category]}</span>
            {result.category}
          </p>
          <button
            onClick={() => setManualOverride(!manualOverride)}
            className="mt-1 text-xs text-green-600 underline"
          >
            {manualOverride ? "Cancel" : "Mali? Palitan ang category"}
          </button>
        </div>
      </div>

      {/* Text-to-Speech Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => handleSpeak(result.category)}
          disabled={isSpeaking}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition active:scale-95 ${
            isSpeaking
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-green-300 bg-white text-green-700 hover:bg-green-50"
          }`}
        >
          {isSpeaking ? "🔊 Nagsasalita..." : "🔊 Pakinggan"}
        </button>
        {isSpeaking && (
          <button
            onClick={handleStop}
            className="rounded-xl border-2 border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-95"
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Manual category override */}
      {manualOverride && (
        <div className="rounded-xl bg-white p-4 shadow-sm border border-green-100 animate-slide-up">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Piliin ang tamang category:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {VALID_CATEGORIES.filter((c) => c !== "other").map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition active:scale-95 ${
                  cat === result.category
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-green-300"
                }`}
              >
                {CATEGORY_EMOJI[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Best Action — Hero Card */}
      <div className="rounded-xl bg-green-600 p-5 text-white shadow-lg animate-slide-up">
        <p className="text-xs uppercase tracking-wider text-green-200 mb-1">
          Pinakamainam na gawin
        </p>
        <p className="text-sm font-medium flex items-center gap-2">
          <span className="text-xl">{R_ICONS[data.bestAction]}</span>
          <span className="uppercase font-bold">{data.bestAction}</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-green-50">
          {data.bestActionSummary}
        </p>
      </div>

      {/* 5R Recommendation Cards */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Lahat ng 5R Options
        </h3>
        {rKeys.map((r) => {
          const content = data[r];
          if (content === null) return null;

          const isBest = r === data.bestAction;
          return (
            <div
              key={r}
              className={`rounded-xl border p-4 shadow-sm transition ${R_COLORS[r]} ${
                isBest ? "ring-2 ring-green-500 ring-offset-1" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{R_ICONS[r]}</span>
                <span className="text-sm font-bold uppercase">{r}</span>
                {isBest && (
                  <span className="ml-auto text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => {
            stopSpeech();
            sessionStorage.removeItem("suri-result");
            sessionStorage.removeItem("suri-result-logged");
            sessionStorage.removeItem("suri-spoken");
            router.push("/scan");
          }}
          className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95"
        >
          📸 Mag-scan Ulit
        </button>
        <button
          onClick={() => router.push("/proof")}
          className="rounded-xl border-2 border-green-300 px-4 py-3 font-medium text-green-700 transition hover:bg-green-50 active:scale-95"
        >
          📝 Proof
        </button>
      </div>
    </div>
  );
}
