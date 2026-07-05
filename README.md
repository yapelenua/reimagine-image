# Reimagine Image

A small browser-based image editor (Vue 3 + Vuetify + Pinia + TypeScript): upload, crop, adjust brightness/contrast/saturation, apply a filter, and export — non-destructively.

## Requirements

- Node.js 18+

## Setup

```bash
npm i
cp .env.example .env
```

Fill in `.env` with your Supabase project keys:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Supabase is only needed for sign-in and saving to history/presets — uploading, cropping, adjusting, and exporting an image work without it.

## Run

```bash
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Other scripts

| Command                | What it does                          |
| ----------------------- | -------------------------------------- |
| `npm run build`         | Type-checks and builds for production  |
| `npm run preview`       | Serves the production build locally    |
| `npm run typecheck`     | `vue-tsc --noEmit`                      |
| `npm run lint`          | ESLint                                  |
| `npm run format`        | Prettier — writes `src/`                |
| `npm run format:check`  | Prettier — checks `src/` without writing|

