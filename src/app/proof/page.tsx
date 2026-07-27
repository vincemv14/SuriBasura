"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { strings } from "@/lib/strings";

const R_OPTIONS = [
  { value: "reduce", emoji: "🚫", label: "Reduce" },
  { value: "reuse", emoji: "♻️", label: "Reuse" },
  { value: "recover", emoji: "⚡", label: "Recover" },
  { value: "recycle", emoji: "🔄", label: "Recycle" },
  { value: "repair", emoji: "🔧", label: "Repair" },
];

export default function ProofPage() {
  const router = useRouter();
  const s = strings.proof;

  const [rCategory, setRCategory] = useState("");
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError("");

    if (!rCategory) {
      setError("Pumili ng R category.");
      return;
    }
    if (!beforePhoto || !afterPhoto) {
      setError(s.errorNoPhotos);
      return;
    }
    if (!caption.trim()) {
      setError(s.errorNoCaption);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rCategory,
          beforePhoto,
          afterPhoto,
          caption: caption.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || strings.errors.generic);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError(strings.errors.network);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center animate-fade-in">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-green-800">{s.successTitle}</h2>
        <p className="text-sm text-gray-600 max-w-xs">{s.successMessage}</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/scan")}
            className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-md hover:bg-green-700 active:scale-95"
          >
            📸 Mag-scan ulit
          </button>
          <button
            onClick={() => router.push("/badges")}
            className="rounded-xl border-2 border-green-300 px-5 py-3 font-medium text-green-700 hover:bg-green-50 active:scale-95"
          >
            🏅 Mga Badge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">{s.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
      </div>

      {/* R Category Selection */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{s.selectR}</p>
        <div className="grid grid-cols-5 gap-2">
          {R_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRCategory(opt.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 text-xs font-medium transition active:scale-95 ${
                rCategory === opt.value
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-300"
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Before Photo */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{s.beforePhoto}</p>
        {beforePhoto ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforePhoto} alt="Before" className="w-full h-48 object-cover rounded-lg border-2 border-green-200" />
            <button
              onClick={() => { setBeforePhoto(null); }}
              className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs shadow"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => beforeInputRef.current?.click()}
            className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-green-300 hover:text-green-500 transition"
          >
            📷 Tap para kumuha ng photo
          </button>
        )}
        <input ref={beforeInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e, setBeforePhoto)} />
      </div>

      {/* After Photo */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{s.afterPhoto}</p>
        {afterPhoto ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterPhoto} alt="After" className="w-full h-48 object-cover rounded-lg border-2 border-green-200" />
            <button
              onClick={() => { setAfterPhoto(null); }}
              className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs shadow"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => afterInputRef.current?.click()}
            className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-green-300 hover:text-green-500 transition"
          >
            📷 Tap para kumuha ng photo
          </button>
        )}
        <input ref={afterInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e, setAfterPhoto)} />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {s.captionLabel}
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={s.captionPlaceholder}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95 disabled:opacity-50"
      >
        {loading ? s.submitting : s.submitButton}
      </button>
    </div>
  );
}
