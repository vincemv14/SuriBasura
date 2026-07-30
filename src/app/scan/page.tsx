"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { strings } from "@/lib/strings";
import { compressImage } from "@/lib/compress-image";
import {
  FIVE_R_DATA,
  TrashCategory,
  VALID_CATEGORIES,
  CATEGORY_EMOJI,
} from "@/lib/categories";

function mapCategoryToR(category: TrashCategory): string {
  const data = FIVE_R_DATA[category];
  return data?.bestAction || "reduce";
}

type CaptureMode = "camera" | "upload" | null;

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<CaptureMode>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showManualPicker, setShowManualPicker] = useState(false);

  const s = strings.scan;

  const startCamera = useCallback(async () => {
    setMode("camera");
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError(s.errorCamera);
    }
  }, [s.errorCamera]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image too large. Max 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setMode("upload");
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const reset = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    setMode(null);
    setShowManualPicker(false);
    stopCamera();
  }, [stopCamera]);

  const navigateToResult = useCallback(
    (category: TrashCategory) => {
      const recommendedR = mapCategoryToR(category);

      // Save to DB (non-blocking)
      if (capturedImage) {
        fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: capturedImage,
            detectedItem: category,
            recommendedR,
          }),
        }).catch(() => {});
      }

      sessionStorage.setItem(
        "suri-result",
        JSON.stringify({
          category,
          image: capturedImage,
          timestamp: new Date().toISOString(),
        })
      );
      router.push("/result");
    },
    [capturedImage, router]
  );

  const classify = useCallback(async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setError(null);
    setShowManualPicker(false);

    try {
      // Compress image before sending to API (reduces from ~5MB to ~50-100KB)
      const compressed = await compressImage(capturedImage, 512);

      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressed }),
      });

      if (res.status === 429) {
        setError(strings.errors.rateLimit);
        setShowManualPicker(true);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || s.errorClassify);
        setShowManualPicker(true);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      navigateToResult(data.category);
    } catch {
      setError(strings.errors.network);
      setShowManualPicker(true);
      setIsLoading(false);
    }
  }, [capturedImage, navigateToResult, s.errorClassify]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">{s.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
      </div>

      {/* Capture Options */}
      {!capturedImage && !mode && (
        <div className="flex flex-col gap-3 animate-slide-up">
          <button
            onClick={startCamera}
            className="flex items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 text-white font-semibold shadow-md transition hover:bg-green-700 active:scale-95"
          >
            {s.cameraButton}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 rounded-xl border-2 border-green-300 bg-white px-6 py-4 font-semibold text-green-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 active:scale-95"
          >
            {s.uploadButton}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Manual option — skip AI entirely */}
          <button
            onClick={() => { setCapturedImage("manual"); setShowManualPicker(true); }}
            className="text-xs text-gray-400 underline mt-2"
          >
            Walang camera? Pumili ng category manually
          </button>
        </div>
      )}

      {/* Camera View */}
      {mode === "camera" && !capturedImage && (
        <div className="flex flex-col gap-3 animate-slide-up">
          {cameraError ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center text-sm text-red-700">
              {cameraError}
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-xl border-2 border-green-300 bg-black">
                <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-xl pointer-events-none" />
              </div>
              <button onClick={capturePhoto} className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-white font-semibold shadow-md transition hover:bg-green-700 active:scale-95">
                {s.captureButton}
              </button>
            </>
          )}
          <button onClick={reset} className="text-sm text-gray-500 underline">← Back</button>
        </div>
      )}

      {/* Preview + Confirm */}
      {capturedImage && capturedImage !== "manual" && !showManualPicker && (
        <div className="flex flex-col gap-4 animate-slide-up">
          <div className="overflow-hidden rounded-xl border-2 border-green-300 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capturedImage} alt="Captured trash item" className="w-full aspect-[4/3] object-cover" />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
              <p className="text-sm text-gray-500 animate-pulse">{s.identifyingItem}</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-medium text-gray-600 transition hover:bg-gray-50 active:scale-95">
                {s.retakeButton}
              </button>
              <button onClick={classify} className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95">
                {s.classifyButton}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual Category Picker (fallback or when API fails) */}
      {showManualPicker && (
        <div className="flex flex-col gap-4 animate-slide-up">
          {capturedImage && capturedImage !== "manual" && (
            <div className="overflow-hidden rounded-xl border-2 border-green-300 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Captured trash item" className="w-full h-32 object-cover" />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700 text-center">
              {error} — Pumili na lang ng category manually:
            </div>
          )}

          <p className="text-sm font-medium text-gray-700">Anong klaseng basura ito?</p>
          <div className="grid grid-cols-2 gap-2">
            {VALID_CATEGORIES.filter((c) => c !== "other").map((cat) => (
              <button
                key={cat}
                onClick={() => navigateToResult(cat)}
                className="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-xs font-medium transition hover:border-green-400 hover:bg-green-50 active:scale-95 flex items-center gap-2"
              >
                <span className="text-lg">{CATEGORY_EMOJI[cat]}</span>
                <span className="capitalize">{cat}</span>
              </button>
            ))}
          </div>

          <button onClick={reset} className="text-sm text-gray-500 underline mt-2">← Bumalik</button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
