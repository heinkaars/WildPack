# Security items skipped as risky

- 2026-10-23 — Dependency update (`npm audit fix` + `npx expo install --fix`): skipped; audit fix rewrote ~1000 lines of package-lock.json that cannot be verified without a device, 9 vulnerabilities remain, and `expo install --fix` could not reach the network.
- 2026-10-23 — `authed()` wrapper refactor of the three API routes: skipped; pre-judged risky (rewrites the auth path of every route).
- 2026-10-23 — Removing the 'species.upsert' case in lib/sync.ts: skipped; pre-judged risky (touches the sync/outbox path).
- 2026-10-26 — Throw at startup in lib/api-guard.ts when NODE_ENV is production and SUPABASE_SERVICE_ROLE_KEY is missing or TRUSTED_PROXY_HOPS < 1: skipped; a module-load throw takes down every API route (identify included) on any deploy missing those vars, and it would also break the documented `expo export && expo serve` local test (no proxy there), which can't be checked without the deploy's env.
