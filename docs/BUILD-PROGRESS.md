# WildPack MVP — build progress

The MVP is the prototype codebase with its UI rebuilt from Figma, one section per chat.
Data layer, auth, sync, AI routes and security fixes stay as they are.

Figma file `Foqg4MWr8YslYW5bKKS1Y2` ("WildPack Final Version"): handoff doc `88386:2`,
components `1:220`, icons `161:749`.

| # | Section | Status |
|---|---------|--------|
| 1 | Foundations (theme, fonts, gradient, shared components, artwork) | **Done** — branch `mvp/foundations` |
| 2 | Auth | Next |
| 3 | Onboarding | — |
| 4 | Capture & identify | — |
| 5 | Home / profile / life list | — |
| 6 | Species detail + Ask chat | — |
| 7 | "Looks" collection (new) | — |

## What Foundations gives the next sections

**See it:** run the dev server and open `/dev/components` (dev builds only). It shows every
token and component below, and it skips the onboarding redirect.

**Tokens — `lib/theme.ts`**
- `colors`: `primary` #FF9900, `warning` #F94F40, `text` #21262E (+ `textSecondary` 80%,
  `textMuted` 60%, `textDisabled` 50%), `cream` #FFEBCC, `progressTrack` #C2A264, and the
  translucent fills `fill` (dark 6%, input background), `fillStrong` (dark 10%, locked badge),
  `stroke`, `warningFill`, `warningStroke`.
- `gradient` — 180°, #FF9900 → #F94F40. Use `<Gradient>` rather than LinearGradient directly.
- `fonts` / `type` — Baloo 2 headings (`display`, `h1`–`h3`), Nunito body (`bodyLarge`, `body`,
  `bodyBold`, `label`, `small`, `caption`, `button`). Fonts load in `app/_layout.tsx`.
- `spacing.screen` = 20 (screen side padding); `sizes.button` / `sizes.input` = 56.
- **Legacy names** (`forest`, `ink`, `inkMuted`, `border`, `amber`, …) still exist and point at
  the new palette so un-rebuilt screens keep working. Use the new names in rebuilt screens; delete
  the legacy block once no file uses them.

**Components — `components/ui/` (import from `components/ui`)**
- `Button` — `variant` `primary` (gradient) / `secondary` (white) / `outline`; `disabled` = 30%
  opacity; `chevronLeft` / `chevronRight`.
- `Input` — 56px pill; focus shows the outline, `error` gives the red state, `disabled`, `dropdown`
  chevron. `ChatInput` — the AI chat field with gradient send button.
- `BottomNav` — `active: 'home' | 'capture'`. Position it on the screen (it just centres itself).
- `BadgeTile` — `badge` 1–13, `earned`. Earned = pastel tile + orange icon, locked = grey.
- `Docent` — circular portrait, `animal` lion / rhino / gecko / raccoon, `mood` happy / sad.
  Happy is the guide everywhere; sad is for failures and wrong species.
- `DocentCard` — full-body docent for the onboarding picker, with `selected` state.
- `ScreenStatusBar` — sets the phone's status-bar colour (`tone`) and reserves the top inset.
  Figma's status bar / home indicator are the OS's own, so they are not redrawn.
- Icons in `components/ui/icons.tsx` (chevrons, home, camera-lens, send, check) are the
  Figma SVG paths.
- `components/PrimaryButton.tsx` is kept as a thin wrapper over `Button` for old screens
  (`secondary` → outline, `ghost` → text link). Switch callers to `Button` as screens are rebuilt.

**Artwork — `assets/`**
- `docents/{lion,rhino,gecko,raccoon}-{happy,sad,full}.png` — transparent.
- `badges/badge-01.png` … `badge-13.png` — white masks tinted by `BadgeTile`. Animals in
  order: squirrel, fox, mouse, raccoon, lion, tiger, bat, cobra (best guess), elephant, hippo,
  wolf, giraffe, lynx.

## Open items / decisions for later chats

- **Figma call limit:** the Figma account is on the Starter plan (View seat), which allows only a
  handful of MCP calls a month; Foundations used it up on 2026-10-13. Later sections need screen
  designs from Figma, so either upgrade the seat/plan or paste screenshots + specs into the chat.
- **Heading sizes are provisional.** Button/label/chat text sizes come straight from Figma; the
  `display` / `h1`–`h3` sizes were chosen to fit, because the type scale couldn't be pulled
  before the limit hit. Check them against the handoff doc and adjust `type` in `lib/theme.ts`.
- **Badges aren't mapped to milestones yet.** `lib/milestones.ts` has 6 milestones; Figma has 13
  badges. Decide the mapping in section 5 (profile).
- **Docent choice isn't stored yet.** The onboarding picker (section 3) needs somewhere to save
  the chosen docent — that's a data-layer change, so plan it there.
- **Preview pane can't sign in:** the in-app browser can't reach Supabase, so normal screens sit
  on the "WildPack" cover there. Use `/dev/components`, a phone, or a regular browser.
- Design gaps still to ask about when reached: delete-account confirmation, loading/error
  states, "Looks" data model, off-topic chat handling.
