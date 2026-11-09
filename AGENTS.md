# WildPack Development Guide

## Expo Setup
- **Version:** SDK 58 (expo 58.0.23, React Native 0.88, React 19.3.0). Read docs at https://docs.expo.dev/versions/v58.0.0/
- **Why 58:** the App Store's Expo Go only runs the newest SDK. When it moves on, the phone stops opening the project, so upgrade on a branch (`npm install expo@<new> && npx expo install --fix`, then `npx tsc --noEmit` and `npx expo-doctor`).
- **`typedRoutes` stays off:** on SDK 58 it made the dev server rebuild in a loop until Node ran out of memory (about a minute after start). Only re-enable after checking the server stays up.
- **RN 0.86+:** `StyleSheet.absoluteFillObject` is gone. Spread `absoluteFill` from `lib/theme.ts` instead; on web, `StyleSheet.absoluteFill` is a precompiled style and can't be spread.
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

## Hosting: API routes on EAS Hosting
- **Live at** `https://wildpack.expo.app` (Expo's EAS Hosting, free plan). Native builds reach `/api/*` through the expo-router `origin` in `app.json`; in development the origin is the dev server, so local work is unaffected.
- **Redeploy after changing anything under `app/api/` or `lib/` code those routes use:** `npx expo export -p web && npx eas-cli deploy --prod --environment production`. Deployments are immutable, so a changed env var also needs a redeploy.
- **Server env vars live on EAS** (production environment): `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` as *sensitive* (a *secret* one cannot reach Hosting), `TRUSTED_PROXY_HOPS=1`, and the two `EXPO_PUBLIC_SUPABASE_*`. EAS values win over a local `.env`.
- **`TRUSTED_PROXY_HOPS=1` was measured, not guessed:** EAS Hosting replaces any `x-forwarded-for` the caller sends with just the real address, so the single entry is unforgeable.
- **Testing the hosted API in Expo Go:** use the `wildpack-hosted` launch config (`EXPO_NO_METRO_LAZY=1 npx expo start --no-dev --minify --port 8090`). `--no-dev` makes Expo Go use the `origin`; without `EXPO_NO_METRO_LAZY=1` it would also fetch lazily split chunks (the `expo-sqlite` dynamic import) from that origin, which serves only API routes, and the app hangs on its splash. Start it from a terminal rather than the preview pane: the pane's health checks trigger repeated web builds in `--no-dev` mode until Node runs out of memory. Release builds ship one bundle and are unaffected (checked with `npx expo export -p ios`). Verified on a real iPhone 2026-11-09.
- **Free-plan limits:** 100k requests/month, 10 outgoing calls per request, 10 ms CPU per request. A 7.6M-char base64 photo through identify passed in practice (2026-11-06). Delete account pages Storage by 1,000 to stay under the call limit. If limits bite, the $19/month Starter plan lifts them.
