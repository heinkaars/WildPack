# WildPack Development Guide

## Expo Setup
- **Version:** SDK 57 (expo 57.0.30, React Native 0.86, React 19.2). Read docs at https://docs.expo.dev/versions/v57.0.0/
- **Why 57:** the App Store's Expo Go only runs the newest SDK. When it moves on, the phone stops opening the project, so upgrade on a branch (`npm install expo@<new> && npx expo install --fix`, then `npx tsc --noEmit` and `npx expo-doctor`).
- **RN 0.86:** `StyleSheet.absoluteFillObject` is gone. Spread `absoluteFill` from `lib/theme.ts` instead; on web, `StyleSheet.absoluteFill` is a precompiled style and can't be spread.
- **Dev server:** `npm start --port 8090` (port is required; passed in `.claude/launch.json`)
- **Full restart needed:** when adding new `+api.ts` files — hot reload doesn't pick them up
- **Android permissions:** Configured in `app.json` for camera, audio recording, and audio settings
- **EAS setup:** Project ID and owner configured in `app.json` for Expo Application Services builds

## Web SSR Traps
`app.json` has `"web": {"output": "server"}` for API routes. This pre-renders in Node and crashes the dev server if module-level code touches browser/native globals:

1. **AsyncStorage + window:** Use `typeof window === 'undefined'` to guard, not `Platform.OS`. AsyncStorage's web build reads `window.localStorage` and ReferenceError crashes the entire server.
2. **expo-sqlite in Node:** Lazy-import (`await import('expo-sqlite')` inside `connect()`) with type-only static import; it can't load at module parse time. It must be a dynamic `import()`, not `require()`: since SDK 57 a synchronous require pulls expo-sqlite's web worker into the main graph and the server render fails with "Worker chunk not found for: …/expo-sqlite/web/worker.ts".

## Data Layer: Supabase + SQLite Sync
- **Single source of truth:** `sightings` table; `lifelist` is a Postgres view
- **Snappy pattern:** screens read local SQLite only (`lib/db.ts`); writes go local-first → `outbox` table → `lib/sync.ts` drains with retry
- **Never block the UI on network**
- Schema: `supabase/schema.sql` (idempotent, re-run to reapply)

## AI Backend: OpenAI → iNaturalist
Temporary: using `gpt-4o-mini` for wildlife ID and AMA, running server-side via Expo Router API routes:
- [`app/api/identify+api.ts`](app/api/identify+api.ts) — vision identification
- [`app/api/ama+api.ts`](app/api/ama+api.ts) — chat responses
- Swap point when iNaturalist API lands: server routes only. Clients (`lib/identify-service.ts`, `lib/ama-service.ts`) see no change if response shapes stay the same.
- Photo capture: request `base64: true` directly from camera/picker (not via file path afterward — `expo-file-system` File class unreliable on real devices)
- `OPENAI_API_KEY` in `.env` (gitignored); never ships in bundle
