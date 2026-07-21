import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center animate-fade-in">
      <div className="text-6xl">♻️</div>
      <div>
        <h2 className="text-3xl font-bold text-green-800">SuriBasura</h2>
        <p className="mt-1 text-sm text-green-600 font-medium">
          Environment Meets Technology
        </p>
      </div>
      <p className="max-w-sm text-gray-600 leading-relaxed">
        Take a photo of any trash item and learn the best way to handle it using
        the <strong>5R Framework</strong>: Reduce, Reuse, Recover, Recycle &amp;
        Repair.
      </p>

      <div className="grid w-full max-w-xs gap-3">
        <Link
          href="/scan"
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl active:scale-95"
        >
          📸 Scan Trash Item
        </Link>
      </div>

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

      <p className="text-xs text-gray-400 mt-4">
        Part of Project iKNOWbasyon • Liliw, Laguna
      </p>
    </div>
  );
}
