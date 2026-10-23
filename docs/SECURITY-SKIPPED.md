# Security items skipped as risky

- 2026-10-23 — Dependency update (`npm audit fix` + `npx expo install --fix`): skipped; audit fix rewrote ~1000 lines of package-lock.json that cannot be verified without a device, 9 vulnerabilities remain, and `expo install --fix` could not reach the network.
- 2026-10-23 — `authed()` wrapper refactor of the three API routes: skipped; pre-judged risky (rewrites the auth path of every route).
- 2026-10-23 — Removing the 'species.upsert' case in lib/sync.ts: skipped; pre-judged risky (touches the sync/outbox path).
