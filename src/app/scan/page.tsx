"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { strings } from "@/lib/strings";
import { compressImage } from "@/lib/compress-image";
import {
  FIVE_R_DATA,
  TrashCategory,
  searchCategories,
  CategoryInfo,
} from "@/lib/categories";

function mapCategoryToR(category: TrashCategory): string {
  const data = FIVE_R_DATA[category];
  return data?.bestAction || "reduce";
}

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(true);

  const s = strings.scan;

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
        setShowCategories(false);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const navigateToResult = useCallback(
    (category: TrashCategory) => {
      const recommendedR = mapCategoryToR(category);

      // Save to DB (non-blocking)
      if (capturedImage && capturedImage !== "none") {
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
          image: capturedImage || "",
          timestamp: new Date().toISOString(),
        })
      );
      router.push("/result");
    },
    [capturedImage, router]
  );

  const classifyWithAI = useCallback(async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setError(null);

    try {
      const compressed = await compressImage(capturedImage, 512);
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressed }),
      });

      if (res.status === 429) {
        setError(strings.errors.rateLimit + " Pumili na lang ng category sa baba.");
        setShowCategories(true);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError((data.error || s.errorClassify) + " Pumili na lang ng category sa baba.");
        setShowCategories(true);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      navigateToResult(data.category);
    } catch {
      setError(strings.errors.network + " Pumili na lang ng category sa baba.");
      setShowCategories(true);
      setIsLoading(false);
    }
  }, [capturedImage, navigateToResult, s.errorClassify]);

  const filteredCategories: CategoryInfo[] = searchCategories(searchQuery);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">{s.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
      </div>

      {/* Upload Photo Section */}
      {!capturedImage && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 text-white font-semibold shadow-md transition hover:bg-green-700 active:scale-95"
          >
            📁 Mag-upload ng Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <p className="text-xs text-gray-400 text-center">
            O pumili ng category ng basura sa baba
          </p>
        </div>
      )}

      {/* Image Preview + AI Classify */}
      {capturedImage && !showCategories && (
        <div className="flex flex-col gap-3 animate-slide-up">
          <div className="overflow-hidden rounded-xl border-2 border-green-300 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capturedImage} alt="Captured" className="w-full h-48 object-cover" />
          </div>

          {error && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700 text-center">
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
              <button
                onClick={() => { setCapturedImage(null); setError(null); setShowCategories(true); }}
                className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-medium text-gray-600 transition hover:bg-gray-50 active:scale-95"
              >
                {s.retakeButton}
              </button>
              <button
                onClick={classifyWithAI}
                className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95"
              >
                🤖 AI Classify
              </button>
            </div>
          )}
          <button
            onClick={() => setShowCategories(true)}
            className="text-sm text-green-600 underline text-center"
          >
            O pumili ng category manually →
          </button>
        </div>
      )}

      {/* Searchable Category Picker */}
      {(showCategories || !capturedImage) && (
        <div className="flex flex-col gap-3 animate-slide-up">
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hanapin ang basura... (hal. bote, lata, papel)"
              className="w-full rounded-xl border-2 border-green-200 bg-white pl-10 pr-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400">
            {filteredCategories.length} na category{searchQuery ? ` para sa "${searchQuery}"` : ""}
          </p>

          {/* Category Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigateToResult(cat.name)}
                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-3 py-3 text-left text-xs font-medium transition hover:border-green-400 hover:bg-green-50 active:scale-95"
              >
                <span className="text-xl flex-shrink-0">{cat.emoji}</span>
                <span className="capitalize leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">Walang nahanap. Subukan ang ibang keyword.</p>
              <button
                onClick={() => navigateToResult("other")}
                className="mt-3 text-sm text-green-600 underline"
              >
                Gamitin ang &quot;Other&quot; category →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
