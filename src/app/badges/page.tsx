"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";
import { getRewardTier } from "@/lib/badges";

interface Badge {
  id: number;
  name: string;
  name_fil: string;
  tier: string;
  r_required: string | null;
}

interface EarnedBadge {
  id: number;
  badge_id: number;
  earned_at: string;
  redemption_status: string;
  name: string;
  name_fil: string;
  tier: string;
  r_required: string | null;
}

interface ProofStat {
  r_category: string;
  cnt: number;
}

export default function BadgesPage() {
  const s = strings.badges;
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [proofStats, setProofStats] = useState<ProofStat[]>([]);
  const [distinctR, setDistinctR] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch("/api/badges");
        if (res.ok) {
          const data = await res.json();
          setAllBadges(data.allBadges);
          setEarnedBadges(data.earnedBadges);
          setProofStats(data.proofStats);
          setDistinctR(data.distinctRCompleted);
        }
      } catch {
        // Silent fail
      }
      setLoading(false);
    }
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    );
  }

  const earnedIds = new Set(earnedBadges.map((b) => b.badge_id));
  const completedCategories = proofStats.map((p) => p.r_category);
  const allRs = ["reduce", "reuse", "recover", "recycle", "repair"];
  const reward = getRewardTier(distinctR);

  const tierEmoji: Record<string, string> = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    category: "🏅",
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">{s.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
      </div>

      {/* Progress */}
      <div className="rounded-xl bg-white p-4 shadow-md border border-green-100">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          {s.progressTitle}
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl font-bold text-green-700">{distinctR}</span>
          <span className="text-sm text-gray-500">{s.outOf5}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {allRs.map((r) => (
            <div
              key={r}
              className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs ${
                completedCategories.includes(r)
                  ? "bg-green-100 text-green-700 font-bold"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span>{completedCategories.includes(r) ? "✅" : "⬜"}</span>
              <span className="capitalize">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Reward Tier */}
      {distinctR > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <h3 className="text-sm font-bold text-amber-700 mb-2">
            🎁 Reward Tier {reward.tier}
          </h3>
          <ul className="text-sm text-amber-800 space-y-1">
            {reward.items.map((item, i) => (
              <li key={i}>
                • {item.quantity}x {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Badge List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Mga Badge
        </h3>
        {allBadges.map((badge) => {
          const earned = earnedIds.has(badge.id);
          const earnedData = earnedBadges.find((eb) => eb.badge_id === badge.id);
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                earned
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <span className="text-2xl">
                {tierEmoji[badge.tier] || "🏅"}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">
                  {badge.name_fil || badge.name}
                </p>
                {badge.r_required && (
                  <p className="text-xs text-gray-500 capitalize">
                    Category: {badge.r_required}
                  </p>
                )}
              </div>
              <div className="text-right">
                {earned ? (
                  <div>
                    <span className="text-xs text-green-600 font-bold">{s.earned}</span>
                    {earnedData?.redemption_status === "claimed" && (
                      <p className="text-[10px] text-gray-400">{s.rewardClaimed}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">{s.locked}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards Info */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-green-100">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
          {strings.rewards.title}
        </h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• {strings.rewards.tier1}</li>
          <li>• {strings.rewards.tier2}</li>
          <li>• {strings.rewards.tier3}</li>
          <li>• {strings.rewards.tier4}</li>
          <li>• {strings.rewards.tier5}</li>
        </ul>
        <p className="text-xs text-gray-400 mt-2">{strings.rewards.howToClaim}</p>
      </div>
    </div>
  );
}
