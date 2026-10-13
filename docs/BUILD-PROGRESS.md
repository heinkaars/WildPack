# WildPack MVP — build progress

The MVP is the prototype codebase with its UI rebuilt from Figma, one section per chat.
Data layer, auth, sync, AI routes and security fixes stay as they are.

Figma file `Foqg4MWr8YslYW5bKKS1Y2` ("WildPack Final Version"): handoff doc `88386:2`,
components `1:220`, icons `161:749`.

| # | Section | Status |
|---|---------|--------|
| 1 | Foundations (theme, fonts, gradient, shared components, artwork) | **Done** — merged to `master` |
| 2 | Auth (sign in, create account, forgot password, verify code) | **Done** — merged to `master` |
| 3 | Onboarding | Next |
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
  `stroke`, `warningFill`, `warningStroke`, `warningTint` (handoff "badge locked/attention"),
  `switchTrack`.
- `gradient` — 180°, #FF9900 → #F94F40. Use `<Gradient>` rather than LinearGradient directly.
- `fonts` / `type` — named after the Figma text styles (Style Guide → Typography `56514:398`):
  `headingXL` / `headingL` (Fredoka One 48 / 32, big titles), `headingM` (Baloo 24, section
  titles), `button`, `levelSemiBold`, `levelMedium`, `bodyLg`, `bodySm`, `captionLg`, `captionSm`,
  plus the handoff roles `bodyBold` (XP numbers), `label` (14 bold), `labelSm` (12, day pills) and
  `count` (Nunito Black, notification counts). Figma's "Baloo" is the retired single-weight font;
  Baloo 2 ExtraBold is its match. Fonts load in `app/_layout.tsx`.
- `spacing.screen` = 20 (screen side padding); `sizes.button` / `sizes.input` = 56.
- **Legacy names** (`forest`, `ink`, `inkMuted`, `border`, `amber`, …) still exist and point at
  the new palette so un-rebuilt screens keep working. Use the new names in rebuilt screens; delete
  the legacy block once no file uses them.

**Components — `components/ui/` (import from `components/ui`)**
- `Button` — `variant` `primary` (gradient) / `secondary` (white) / `outline`; `disabled` = 30%
  opacity; `loading` (spinner); `chevronLeft` / `chevronRight`. Height 56 (see open items).
- `Input` — 56px pill; focus shows the outline, `error` gives the red state, `disabled`, `dropdown`
  chevron. `ChatInput` — the AI chat field with gradient send button.
- `Checkbox`, `Radio`, `Switch` — the Figma controls (`checked`, `onChange`), with enlarged
  tap areas. Checkbox is for "stay signed in"; Switch for the profile location toggle.
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

## What Auth added

Figma: SignIn `88384:3985`, SignUP `88384:4021`. Forgot password and the code screen have no
Figma frames; they reuse the same frame.

- `components/AuthScreen.tsx` — the shared auth frame: the orange/lime wash (`AuthBackground`),
  back button, optional `wordmark`, title + subtitle, error box. Also `PasswordInput` (eye
  toggle), `FieldNote`, `MessageBox` (info = soft orange, error = warning tint), `ActionGroup`
  (button with its link underneath), `TextLink`, `PromptLink` ("Already have an account? **Sign in**").
- `components/ui/BackButton.tsx` — the 44px round back button. `EyeIcon` / `EyeOffIcon` in icons
  (the eye-off is the matching icon from the same set, not on the Figma screens).
- `Input` takes a `trailing` element. New tokens: `colors.primaryFill`, `colors.wordmark`
  (#FF4C00), `colors.backButtonFill`.
- **Button height is 60** (`sizes.button`), which settles the 56-vs-60 question.
- `/dev/auth?screen=sign-in|create-account|forgot-password|verify` shows each auth screen in the
  preview without a server (dev builds only).
- Decisions: "Keep me signed in" is left out (the app always stays signed in, since accounts
  start anonymous). Create Account adds a confirm-password field, the button says "Create
  account". Placeholders are just "Email" / "Password" (user's call, not Figma's "Enter …"/"Write …").
  Sign-in/merge logic is unchanged.

## Open items / decisions for later chats

- **Figma access:** now on a Full seat, so there's no tight call limit. The page listing only
  returns the Cover page, so ask the user for a node link per screen.
- **Still to build from screens:** the "X% confidence" pill (Capture & identify). It isn't on the
  Components page, so take it from the screen frame.
- **Placeholder colour.** Figma draws input placeholders in full dark; `Input` uses 60% so typed
  text and hints look different. Revisit if the designer wants the exact Figma look.
- **Account screen (`app/account.tsx`)** links to the auth screens but isn't rebuilt yet — it
  belongs with section 5 (profile).
- **Locked badge colour.** The badge component uses grey (dark 10%) for locked; the handoff also
  mentions a red "attention" tint (`colors.warningTint`). Check which one the Home screen uses.
- **Badges aren't mapped to milestones yet.** `lib/milestones.ts` has 6 milestones; Figma has 13
  badges. Decide the mapping in section 5 (profile).
- **Docent choice isn't stored yet.** The onboarding picker (section 3) needs somewhere to save
  the chosen docent — that's a data-layer change, so plan it there.
- **Preview pane can't sign in:** the in-app browser can't reach Supabase, so normal screens sit
  on the "WildPack" cover there. Use `/dev/components`, a phone, or a regular browser.
- Design gaps still to ask about when reached: delete-account confirmation, loading/error
  states, "Looks" data model, off-topic chat handling.
