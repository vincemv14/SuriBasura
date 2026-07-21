import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SuriBasura — iKNOWbasyon",
  description:
    "Scan trash, learn the 5Rs. A community waste classification tool powered by AI. Part of Project iKNOWbasyon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-green-50 antialiased">
        <header className="sticky top-0 z-50 bg-green-700 text-white shadow-md">
          <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">♻️</span>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  SuriBasura
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-green-200">
                  iKNOWbasyon
                </p>
              </div>
            </a>
            <nav className="flex gap-3 text-sm">
              <a
                href="/scan"
                className="rounded-lg px-3 py-1.5 transition hover:bg-green-600"
              >
                Scan
              </a>
              <a
                href="/impact"
                className="rounded-lg px-3 py-1.5 transition hover:bg-green-600"
              >
                Impact
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
