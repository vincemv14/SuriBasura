"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { strings } from "@/lib/strings";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [barangaySchool, setBarangaySchool] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const s = strings.auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), barangaySchool: barangaySchool.trim(), pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/scan");
      router.refresh();
    } catch {
      setError(strings.errors.network);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800">
          {isRegister ? s.registerTitle : s.loginTitle}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isRegister ? s.registerSubtitle : s.loginSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {s.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={s.namePlaceholder}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {s.barangayLabel}
          </label>
          <input
            type="text"
            value={barangaySchool}
            onChange={(e) => setBarangaySchool(e.target.value)}
            placeholder={s.barangayPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {s.pinLabel}
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder={s.pinPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-center tracking-[0.5em] focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95 disabled:opacity-50"
        >
          {loading ? "..." : isRegister ? s.registerButton : s.loginButton}
        </button>
      </form>

      <button
        onClick={() => { setIsRegister(!isRegister); setError(""); }}
        className="text-sm text-green-600 underline text-center"
      >
        {isRegister ? s.switchToLogin : s.switchToRegister}
      </button>

      <a
        href="/admin/login"
        className="text-xs text-gray-400 text-center mt-2"
      >
        Admin Login →
      </a>
    </div>
  );
}
