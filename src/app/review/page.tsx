"use client";

import { useEffect, useState } from "react";

interface ProofItem {
  id: number;
  user_id: number;
  user_name: string;
  barangay_school: string;
  r_category: string;
  before_photo_url: string;
  after_photo_url: string;
  caption: string;
  status: string;
  created_at: string;
}

export default function ReviewPage() {
  const [proofs, setProofs] = useState<ProofItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchProofs = async () => {
    try {
      const res = await fetch("/api/proof/review");
      if (res.ok) {
        const data = await res.json();
        setProofs(data.proofs);
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleAction = async (proofId: number, action: string) => {
    setActionLoading(proofId);
    try {
      const res = await fetch("/api/proof/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofId, action }),
      });
      if (res.ok) {
        setProofs((prev) => prev.filter((p) => p.id !== proofId));
      }
    } catch {
      // silent
    }
    setActionLoading(null);
  };

  const rEmoji: Record<string, string> = {
    reduce: "🚫",
    reuse: "♻️",
    recover: "⚡",
    recycle: "🔄",
    repair: "🔧",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">Review Queue</h2>
        <p className="text-sm text-gray-500 mt-1">
          {proofs.length} pending submission{proofs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {proofs.length === 0 ? (
        <div className="rounded-xl bg-white p-8 shadow-md border border-green-100 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-sm text-gray-500">
            Walang pending submissions! Lahat na-review na.
          </p>
        </div>
      ) : (
        proofs.map((proof) => (
          <div
            key={proof.id}
            className="rounded-xl bg-white p-4 shadow-md border border-green-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-800">{proof.user_name}</p>
                <p className="text-xs text-gray-400">{proof.barangay_school}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 capitalize">
                {rEmoji[proof.r_category]} {proof.r_category}
              </span>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase">Before</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proof.before_photo_url}
                  alt="Before"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase">After</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proof.after_photo_url}
                  alt="After"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            </div>

            {/* Caption */}
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2 mb-3 italic">
              &ldquo;{proof.caption}&rdquo;
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(proof.id, "approved")}
                disabled={actionLoading === proof.id}
                className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 active:scale-95 disabled:opacity-50"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => handleAction(proof.id, "flagged")}
                disabled={actionLoading === proof.id}
                className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600 active:scale-95 disabled:opacity-50"
              >
                🚩 Flag
              </button>
              <button
                onClick={() => handleAction(proof.id, "rejected")}
                disabled={actionLoading === proof.id}
                className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-600 active:scale-95 disabled:opacity-50"
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
