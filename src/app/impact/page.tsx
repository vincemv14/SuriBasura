"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";

interface ImpactData {
  totalScans: number;
  totalApproved: number;
  totalBadges: number;
  todayScans: number;
  categoryBreakdown: Array<{ r_category: string; cnt: number }>;
  topBarangay: string | null;
}

const rEmoji: Record<string, string> = {
  reduce: "🚫",
  reuse: "♻️",
  recover: "⚡",
  recycle: "🔄",
  repair: "🔧",
};

export default function ImpactPage() {
  const s = strings.impact;
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch("/api/impact");
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // Fall back to zeros
        setData({
          totalScans: 0,
          totalApproved: 0,
          totalBadges: 0,
          todayScans: 0,
          categoryBreakdown: [],
          topBarangay: null,
        });
      }
      setLoading(false);
    }
    fetchImpact();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">{s.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">{data.totalScans}</p>
          <p className="text-xs text-gray-500 mt-1">{s.totalScans}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">{data.todayScans}</p>
          <p className="text-xs text-gray-500 mt-1">{s.today}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">{data.totalApproved}</p>
          <p className="text-xs text-gray-500 mt-1">{s.totalProofs}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">{data.totalBadges}</p>
          <p className="text-xs text-gray-500 mt-1">{s.totalBadges}</p>
        </div>
      </div>

      {/* Top Barangay */}
      {data.topBarangay && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
          <p className="text-xs text-amber-600 uppercase tracking-wider">{s.barangayLeader}</p>
          <p className="text-lg font-bold text-amber-800 mt-1">🏆 {data.topBarangay}</p>
        </div>
      )}

      {/* Category Breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Approved Actions by R Category
          </h3>
          <div className="flex flex-col gap-2">
            {data.categoryBreakdown.map((cat) => {
              const total = data.totalApproved || 1;
              const pct = Math.round((Number(cat.cnt) / total) * 100);
              return (
                <div key={cat.r_category} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">
                    {rEmoji[cat.r_category] || "❓"}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="capitalize text-gray-700 font-medium">
                        {cat.r_category}
                      </span>
                      <span className="text-gray-400">
                        {cat.cnt} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.totalScans === 0 && (
        <div className="rounded-xl bg-white p-8 shadow-md border border-green-100 text-center">
          <p className="text-4xl mb-3">📸</p>
          <p className="text-sm text-gray-500">
            Wala pang scans! Pumunta sa <strong>Scan</strong> page para magsimula.
          </p>
        </div>
      )}
    </div>
  );
}
