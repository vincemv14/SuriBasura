"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { mapLabelToCategory } from "@/lib/classifier";

type CaptureMode = "camera" | "upload" | null;

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<mobilenet.MobileNet | null>(null);

  const [mode, setMode] = useState<CaptureMode>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState("Loading AI model...");

  // Load MobileNet model on mount
  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        setLoadingStatus("Setting up TensorFlow...");
        await tf.ready();

        setLoadingStatus("Downloading AI model...");
        const model = await mobilenet.load({ version: 1, alpha: 0.25 });

        if (!cancelled) {
          modelRef.current = model;
          setIsModelLoading(false);
          setLoadingStatus("");
        }
      } catch (err) {
        console.error("Model load error:", err);
        if (!cancelled) {
          setLoadingStatus("");
          setIsModelLoading(false);
          setError("Failed to load AI model. Please refresh the page.");
        }
      }
    }

    loadModel();
    return () => { cancelled = true; };
  }, []);

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
      setCameraError(
        "Could not access camera. Please allow camera permissions or use file upload instead."
      );
    }
  }, []);

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
        setError("Image too large. Please use an image under 10MB.");
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
    stopCamera();
  }, [stopCamera]);

  const classify = useCallback(async () => {
    if (!capturedImage || !modelRef.current || !imgRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Resize image to 224x224 for faster inference
      const img = imgRef.current;
      const offscreen = document.createElement("canvas");
      offscreen.width = 224;
      offscreen.height = 224;
      const ctx = offscreen.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, 224, 224);

      // Create a temporary image from the resized canvas
      const resizedImg = new Image();
      resizedImg.src = offscreen.toDataURL();
      await new Promise((resolve) => { resizedImg.onload = resolve; });

      // Run classification
      const predictions = await modelRef.current.classify(resizedImg, 5);

      if (!predictions || predictions.length === 0) {
        setError("Could not identify the item. Please try with a clearer photo.");
        setIsLoading(false);
        return;
      }

      const result = mapLabelToCategory(predictions);

      // Store result in sessionStorage for the result page
      sessionStorage.setItem(
        "suri-result",
        JSON.stringify({
          category: result.category,
          confidence: result.confidence,
          rawLabel: result.rawLabel,
          image: capturedImage,
          timestamp: new Date().toISOString(),
        })
      );

      router.push("/result");
    } catch (err) {
      console.error("Classification error:", err);
      setError("Classification failed. Please try again.");
      setIsLoading(false);
    }
  }, [capturedImage, router]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">Scan Trash Item</h2>
        <p className="text-sm text-gray-500 mt-1">
          Take a photo or upload an image to identify and classify
        </p>
      </div>

      {/* Model Loading Indicator */}
      {isModelLoading && (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          <p className="text-sm text-green-700">{loadingStatus}</p>
        </div>
      )}

      {/* Capture Options */}
      {!capturedImage && !mode && !isModelLoading && (
        <div className="flex flex-col gap-3 animate-slide-up">
          <button
            onClick={startCamera}
            className="flex items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 text-white font-semibold shadow-md transition hover:bg-green-700 active:scale-95"
          >
            📷 Use Camera
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 rounded-xl border-2 border-green-300 bg-white px-6 py-4 font-semibold text-green-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 active:scale-95"
          >
            📁 Upload Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />
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
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-xl pointer-events-none" />
              </div>
              <button
                onClick={capturePhoto}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-white font-semibold shadow-md transition hover:bg-green-700 active:scale-95"
              >
                📸 Capture
              </button>
            </>
          )}
          <button
            onClick={reset}
            className="text-sm text-gray-500 underline"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Preview + Confirm */}
      {capturedImage && (
        <div className="flex flex-col gap-4 animate-slide-up">
          <div className="overflow-hidden rounded-xl border-2 border-green-300 shadow-md">
            {/* This img is also used by TF.js for classification */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={capturedImage}
              alt="Captured trash item"
              crossOrigin="anonymous"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
              <p className="text-sm text-gray-500 animate-pulse">
                Identifying item...
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-medium text-gray-600 transition hover:bg-gray-50 active:scale-95"
              >
                Retake
              </button>
              <button
                onClick={classify}
                disabled={isModelLoading}
                className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Classify
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Info note */}
      <p className="text-center text-xs text-gray-400 mt-2">
        🔒 AI runs locally in your browser — no images are uploaded to any server.
      </p>
    </div>
  );
}
