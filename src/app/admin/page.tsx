"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";

interface Stats {
  totalUsers: number;
  totalScans: number;
  totalApproved: number;
  totalBadges: number;
  leaderboard: Array<{
    id: number;
    name: string;
    barangay_school: string;
    distinct_r: number;
    total_proofs: number;
  }>;
  barangayStats: Array<{
    barangay_school: string;
    total_proofs: number;
    total_users: number;
  }>;
  categoryBreakdown: Array<{ r_category: string; cnt: number }>;
}

interface Redemption {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
  redemption_status: string;
  user_name: string;
  barangay_school: string;
  badge_name: string;
  tier: string;
}

interface InventoryItem {
  id: number;
  item_name: string;
  item_name_fil: string;
  quantity_available: number;
}

export default function AdminDashboard() {
  const a = strings.admin;
  const [tab, setTab] = useState<"stats" | "rewards" | "review">("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, rewardsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/rewards"),
      ]);

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRedemptions(data.pendingRedemptions);
        setInventory(data.inventory);
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  const handleClaim = async (userBadgeId: number) => {
    const res = await fetch("/api/admin/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userBadgeId }),
    });
    if (res.ok) {
      setRedemptions((prev) => prev.filter((r) => r.id !== userBadgeId));
    }
  };

  const handleUpdateStock = async (itemId: number, quantity: number) => {
    await fetch("/api/admin/rewards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity_available: quantity } : item
      )
    );
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
      <h2 className="text-2xl font-bold text-green-800">{a.dashboard}</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { key: "stats", label: "📊 Stats" },
          { key: "rewards", label: "🎁 Rewards" },
          { key: "review", label: "📋 Review" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
              tab === t.key
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
        <a
          href="/review"
          className="rounded-lg px-3 py-2 text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 ml-auto"
        >
          🔍 Full Review Page
        </a>
      </div>

      {/* Stats Tab */}
      {tab === "stats" && stats && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={a.totalUsers} value={stats.totalUsers} />
            <StatCard label="Total Scans" value={stats.totalScans} />
            <StatCard label={a.totalApproved} value={stats.totalApproved} />
            <StatCard label="Badges Earned" value={stats.totalBadges} />
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
              Leaderboard
            </h3>
            <div className="space-y-2">
              {stats.leaderboard.slice(0, 10).map((user, i) => (
                <div key={user.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-center font-bold text-gray-400">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {user.barangay_school}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-green-600">
                    {user.distinct_r}R / {user.total_proofs} proofs
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
              Approved Proofs by Category
            </h3>
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat.r_category} className="flex justify-between text-sm py-1">
                <span className="capitalize">{cat.r_category}</span>
                <span className="font-bold text-green-600">{cat.cnt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {tab === "rewards" && (
        <div className="flex flex-col gap-4">
          {/* Inventory */}
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
              {a.rewardInventory}
            </h3>
            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="flex-1 text-sm font-medium">{item.item_name}</span>
                  <input
                    type="number"
                    value={item.quantity_available}
                    onChange={(e) =>
                      handleUpdateStock(item.id, parseInt(e.target.value) || 0)
                    }
                    className="w-20 rounded border px-2 py-1 text-center text-sm"
                    min={0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pending Redemptions */}
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
              {a.pendingRedemptions} ({redemptions.length})
            </h3>
            {redemptions.length === 0 ? (
              <p className="text-sm text-gray-400">No pending redemptions.</p>
            ) : (
              <div className="space-y-2">
                {redemptions.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{r.user_name}</p>
                      <p className="text-xs text-gray-400">
                        {r.badge_name} • {r.barangay_school}
                      </p>
                    </div>
                    <button
                      onClick={() => handleClaim(r.id)}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                    >
                      {a.markClaimed}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Tab (mini preview) */}
      {tab === "review" && (
        <div className="text-center py-8">
          <a
            href="/review"
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-green-700 inline-block"
          >
            Open Full Review Queue →
          </a>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border text-center">
      <p className="text-2xl font-bold text-green-700">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
