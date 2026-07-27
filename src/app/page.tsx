import Link from "next/link";
import { strings } from "@/lib/strings";

export default function Home() {
  const s = strings;

  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center animate-fade-in">
      <div className="text-6xl">♻️</div>
      <div>
        <h2 className="text-3xl font-bold text-green-800">{s.app.name}</h2>
        <p className="mt-1 text-sm text-green-600 font-medium">
          {s.app.tagline}
        </p>
      </div>
      <p className="max-w-sm text-gray-600 leading-relaxed">
        {s.app.description} Kumpletuhin ang <strong>5R Challenge</strong> —
        Reduce, Reuse, Recover, Recycle, Repair — at makakuha ng{" "}
        <strong>school supply rewards</strong>!
      </p>

      <div className="grid w-full max-w-xs gap-3">
        <Link
          href="/scan"
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl active:scale-95"
        >
          📸 I-scan ang Basura!
        </Link>
        <Link
          href="/proof"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-300 bg-white px-6 py-3 font-semibold text-green-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 active:scale-95"
        >
          📝 Mag-submit ng Proof
        </Link>
        <Link
          href="/badges"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-300 bg-white px-6 py-3 font-semibold text-green-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 active:scale-95"
        >
          🏅 Mga Badge at Rewards
        </Link>
      </div>

      {/* 5R Icons */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs text-gray-500">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🚫</span>
          <span>Reduce</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">♻️</span>
          <span>Reuse</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">⚡</span>
          <span>Recover</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🔄</span>
          <span>Recycle</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🔧</span>
          <span>Repair</span>
        </div>
      </div>

      {/* Rewards preview */}
      <div className="w-full max-w-xs rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
        <p className="text-sm font-bold text-amber-700 mb-2">🎁 Mga Reward</p>
        <ul className="text-xs text-amber-800 space-y-1">
          <li>• {s.rewards.tier1}</li>
          <li>• {s.rewards.tier2}</li>
          <li>• {s.rewards.tier3}</li>
          <li>• {s.rewards.tier4}</li>
          <li>• <strong>{s.rewards.tier5}</strong></li>
        </ul>
      </div>

      <div className="flex gap-4 mt-4">
        <Link href="/login" className="text-sm text-green-600 underline">
          Mag-login / Register
        </Link>
        <Link href="/admin/login" className="text-xs text-gray-400">
          Admin →
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Part of Project iKNOWbasyon • Liliw, Laguna
      </p>
    </div>
  );
}
