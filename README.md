# ♻️ SuriBasura — Environment Meets Technology

**Part of Project iKNOWbasyon** (sibling to LIKHA-Reef)

A mobile-first web app that identifies trash items via photo and recommends the best action under the **5R Framework**: Reduce, Reuse, Recover, Recycle & Repair.

Built for walk-up kiosk use at community recycling events in Liliw, Laguna.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Google Gemini API** (gemini-1.5-flash, free tier) for image classification
- **Tailwind CSS** for mobile-first styling
- **Vercel** for serverless deployment

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your Gemini API key

Copy the example env file:

```bash
cp .env.example .env.local
```

Then add your key to `.env.local`:

```
GEMINI_API_KEY=your_actual_key_here
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project when prompted
5. Copy the generated key
6. Paste it as the value of `GEMINI_API_KEY` in your `.env.local` file (locally) or in your Vercel Environment Variables (for deployment)

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import → select the repo
3. In the **Environment Variables** section, add:
   - Key: `GEMINI_API_KEY`
   - Value: *(your Gemini API key)*
4. Click Deploy

That's it — no build config changes needed.

## App Screens

| Route | Description |
|-------|-------------|
| `/` | Landing page with project overview |
| `/scan` | Camera capture or file upload → AI classification |
| `/result` | 5R recommendation cards with best-action highlight |
| `/impact` | Community stats (client-side localStorage for v1) |

## Architecture

```
/src
  /app
    /api/classify/route.ts   ← Server-side Gemini API call
    /scan/page.tsx           ← Camera/upload UI
    /result/page.tsx         ← 5R results display
    /impact/page.tsx         ← Community stats
    layout.tsx               ← Shared header/nav
    page.tsx                 ← Landing page
  /lib
    categories.ts            ← Category definitions + 5R content
```

## Notes

- **No accounts/auth** — designed for walk-up, in-person event use
- **Rate limits** — Gemini free tier has per-minute/daily caps; the app shows friendly error messages when limits are hit
- **Internet required** — classification calls go to Google's servers. For offline fallback, consider TF.js/MobileNet
- **Placeholders** — Search for `[PLACEHOLDER` in `categories.ts` to find spots where Liliw-specific drop-off info should be added
