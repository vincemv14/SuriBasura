"use client";

import { useEffect, useState } from "react";
import { CATEGORY_EMOJI, VALID_CATEGORIES, TrashCategory } from "@/lib/categories";

interface ScanLog {
  category: TrashCategory;
  timestamp: string;
}

export default function ImpactPage() {
  const [logs, setLogs] = useState<ScanLog[]>([]);

  useEffect(() => {
    // For v1, we use localStorage to track scans client-side
    // This can be upgraded to Neon DB later
    const stored = localStorage.getItem("suri-scan-logs");
    if (stored) {
      setLogs(JSON.parse(stored));
    }
  }, []);

  // Calculate stats
  const totalScans = logs.length;
  const categoryCounts: Record<string, number> = {};
  for (const log of logs) {
    categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
  }

  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Today's scans
  const today = new Date().toISOString().split("T")[0];
  const todayScans = logs.filter((l) => l.timestamp.startsWith(today)).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">Community Impact</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tracking what we scan and how we act
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">{totalScans}</p>
          <p className="text-xs text-gray-500 mt-1">Total Scans</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">{todayScans}</p>
          <p className="text-xs text-gray-500 mt-1">Today</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">
            {Object.keys(categoryCounts).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Types Found</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-700">
            {sortedCategories[0]?.[0]
              ? CATEGORY_EMOJI[sortedCategories[0][0] as TrashCategory]
              : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Most Common</p>
        </div>
      </div>

      {/* Category Breakdown */}
      {sortedCategories.length > 0 ? (
        <div className="rounded-xl bg-white p-4 shadow-md border border-green-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Breakdown by Category
          </h3>
          <div className="flex flex-col gap-2">
            {sortedCategories.map(([cat, count]) => {
              const percentage = Math.round((count / totalScans) * 100);
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">
                    {CATEGORY_EMOJI[cat as TrashCategory]}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="capitalize text-gray-700 font-medium">
                        {cat}
                      </span>
                      <span className="text-gray-400">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-8 shadow-md border border-green-100 text-center">
          <p className="text-4xl mb-3">📸</p>
          <p className="text-sm text-gray-500">
            No scans yet! Head to the <strong>Scan</strong> page to start
            classifying trash items.
          </p>
        </div>
      )}

      {/* Unused categories */}
      {sortedCategories.length > 0 && (
        <div className="rounded-xl bg-green-50 p-4 border border-green-200">
          <p className="text-xs text-green-700 font-medium mb-2">
            Not yet found:
          </p>
          <div className="flex flex-wrap gap-2">
            {VALID_CATEGORIES.filter((c) => !categoryCounts[c]).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full bg-white border border-green-200 px-2 py-1 text-xs text-gray-500"
              >
                {CATEGORY_EMOJI[cat]} {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-2">
        Stats are stored locally on this device. Future versions will aggregate
        community-wide data.
      </p>
    </div>
  );
}
