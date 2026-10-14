# WildPack MVP — build progress

The MVP is the prototype codebase with its UI rebuilt from Figma, one section per chat.
Data layer, auth, sync, AI routes and security fixes stay as they are.

Figma file `Foqg4MWr8YslYW5bKKS1Y2` ("WildPack Final Version"): handoff doc `88386:2`,
components `1:220`, icons `161:749`.

| # | Section | Status |
|---|---------|--------|
| 1 | Foundations (theme, fonts, gradient, shared components, artwork) | **Done** — merged to `master` |
| 2 | Auth (sign in, create account, forgot password, verify code) | **Done** — merged to `master` |
| 3 | Onboarding | **Done** — merged to `master` |
| 4 | Capture & identify | **Done** — merged to `master` |
| 5 | Home / profile / life list | **Done** — merged to `master` |
| 6 | Species detail + Ask chat | **Built** on `mvp/species` — not merged yet |
| 7 | "Looks" collection | **Done** — it is the docent picker + naming flow, built in Onboarding (`app/onboarding/look.tsx`, `name.tsx`) |

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

## What Onboarding added

Figma: Onboarding `88384:3396`, Choose your Docent `88384:3880` / `88384:3901` (selected),
name `88384:3921` / `3937` / `3953`, Welcome to the Pack `88384:3969`, Get-Start `88384:3416`,
Turn on Location `88384:3433`.

- Flow: `welcome` → `look` (choose docent) → `name` → `pack` (new) → `first-capture`.
  "I have an account" on welcome opens `/auth/sign-in`; the onboarding gate now lets `/auth`
  through, and a successful sign-in marks onboarding complete straight away.
- **Docent choice is stored in `profile.look`** (`lion` / `rhino` / `gecko` / `raccoon`) — no
  data-layer change. `docentFromLook()` (in `components/ui/Docent.tsx`) turns it back into a
  docent; old emoji looks fall back to the lion. `lookEmoji()` gives each docent an emoji so the
  not-yet-rebuilt home screen still shows something sensible.
- `components/onboarding/OnboardingScreen.tsx` — the shared frame (back button, wordmark, wash
  background, bottom buttons above the keyboard). `welcome-bg.ts` is the Figma swoosh SVG.
  Welcome artwork is `assets/onboarding/welcome-*.png` (the Figma exports, placed and cropped as
  in Figma).
- Location: `expo-location` added; the pop-up shows only while the phone has never been asked,
  "Allow Location" triggers the real system prompt. Nothing uses the location yet.
  Permission text is in `app.json` (applies to real builds; Expo Go shows its own).
- `Button` gained `size="compact"` (48px, for the pop-up's side-by-side buttons). New icons
  `PinIcon`, `SparkIcon`. New token `colors.primaryFillStrong` (soft orange 20%) — the selected
  docent card now uses it, as on the onboarding screen (it was brown from the Components page).
- Decisions: name is required (Continue stays off until something is typed, as in Figma); the
  old "Skip for now" is gone from welcome (not in Figma), so the 24h snooze code in
  `lib/onboarding*.ts` is now unused. Copy is Figma's, apart from "Waiting" → "waiting".
- `/dev/onboarding?screen=welcome|look|name|pack|first-capture` previews each screen.

## What Capture & identify added

Figma: Capture-Camera-ON `88384:3811` (+ error overlay `88384:3839`), Captured-species `88384:3477`,
confirmPopup `88384:3496`, otherOption `88384:3596` / `-GsOpossum 88384:3631`. species-Details
`88384:3654` was handed over too but belongs to section 6.

- **Camera** (`app/capture/index.tsx`): Figma's outlined close/flash buttons, lens switcher, shutter,
  gallery + camera-swap buttons, darkened lower half. Pinch zoom, double-tap reset and the
  off/auto/on/torch flash cycle are kept (an "Auto"/"On"/"Torch" chip shows next to the lit flash).
  Lens buttons: 0.5 and 3 switch to the phone's ultra-wide / telephoto lens when iOS reports one
  (matched on the English device names); otherwise only "1×" shows. **Not yet tried on a real
  iPhone** — the simulator has no camera. The gallery button shows the latest capture's photo.
  No camera permission → a pop-up ("Allow Camera" / "Open Settings" once refused for good, or
  "Choose photo").
- **Identifying** (`identify.tsx`): the photo dimmed with a spinner (not in Figma). Every failure —
  including a guess under 30% confidence, which is the case Figma draws ("I have trouble
  identifying this…") — is the error pop-up with the user's docent looking sad, "Retake photo" /
  "Try Again" and a close cross back to the life list.
- **Result** (`result.tsx`): photo, name, scientific name, green `ConfidencePill` ("Best guess" for
  the top pick, "Good guess" for a picked alternative), description, `OtherMatches` accordion
  (closed pill names the picked match, as in the Opossum frame), "Confirm" + "Not Quite, Try Again".
- **Reward pop-up** (`components/capture/CelebrationPopup.tsx`): shown on the result screen after
  Confirm saves the sighting (it used to be on the home screen; `CelebrationModal` and `Confetti`
  are deleted). Docent with Figma's confetti, species card (NEW SPECIES / SEEN AGAIN), Species #N /
  Seen N times, N-day streak, +XP. "Add To Life List" opens the species page over the life list.
  Haptics + chime kept.
- **XP rule (ours, Figma only shows "+70")** in `lib/xp.ts`: new species 50, repeat sighting 10,
  +20 when a milestone is reached, so a first capture is +70. Derived from the life list, nothing
  stored. Section 5 can total it the same way.
- Shared: `Popup` / `PopupButtons` (white card on 70% black; only shows while its screen is in
  front, so a pop-up can't follow the user onto the next screen; to open a sheet screen such as
  the species page from a pop-up, hide the pop-up and navigate in `onDismissed`, or iOS freezes
  the app behind an invisible pop-up), `ConfidencePill`, icons
  (`CloseIcon`, `FlashIcon`, `CameraSwapIcon`, `ShutterIcon`, `LensTimesIcon`, `GalleryIcon`,
  `SpeciesIcon`, `StarIcon`, `BoltIcon`, `ChevronUp`). Tokens `success*`, `lensActive`, `overlay`.
- `/dev/capture?screen=camera|identifying|unsure|offline|result|celebration` previews each state
  with a sample raccoon (`assets/dev/raccoon.jpg`). Confirm on `result` really saves the sample.

## What Home / profile / life list added

Figma: Home `88384:2943`, Home-Profile `88384:3300`.

- **Explorer XP** (`lib/xp.ts`, user's rule: XP comes from streaks, new species, repeat sightings
  and chat questions). New species 50, repeat sighting 10, first capture of a day 20 + 10 per streak
  day before it (max +60), chat question 5 (first 3 per species). First capture = 70, as in Figma.
  `computeStats()` works it all out from local sightings + chat messages (`db.readActivity()`), so
  nothing new is stored or synced. It also gives the capture count, the live streak (0 once a day is
  missed; the stored profile streak is no longer shown) and the days with a capture.
  `useLifelist()` now exposes `stats` and `refresh()`; a chat question refreshes it.
- **Badges** (`lib/badges.ts`): the 13 badges unlock at 50 / 150 / 300 / 600 / 1000 / 1500 / 2200 /
  3000 / 4000 / 5200 / 6500 / 8000 / 10000 XP. Only "Safari Starter" (badge 4) is a Figma name; the
  rest are ours. `lib/milestones.ts` is gone; the reward pop-up's XP is now the XP the capture really
  earned (`xpEarned` on the payload, plus `badge` when one was unlocked — no slot shows it yet).
  Locked badges use grey (dark 10%); the red tint in Figma isn't used.
- **Home** (`components/home/HomeView.tsx`, used by `app/index.tsx`): greeting by time of day,
  avatar → profile, streak pill, this week's capture days, XP bar "N XP more to unlock <badge>",
  badge row (tap a badge → pop-up with its name and XP), life list, bottom nav.
- **Life list:** own finds first, then "Not found yet" teasers (`lib/teasers.ts`, the 9 Figma animal
  photos in `assets/lifelist/`). A teaser disappears once a found species has that animal's name in
  it ("Red Fox" hides the fox). **Filter** pop-up (not in Figma): category + sort (recently seen,
  first found, A–Z, most seen); teasers hide while it is changed. `lib/lifelist-view.ts`.
- **Profile** (`components/profile/ProfileView.tsx`, used by `app/account.tsx`, now a normal pushed
  screen with Figma's back button instead of a modal): docent, tap-to-edit name, email when signed
  in, 4 stats, docent picker (check on the chosen one), Location switch, account rows. Signed in:
  Log out (confirm pop-up). Account only on this phone: "Create an account" / "I have an account"
  plus a note that the list only lives on this phone. Dev builds: "Replay onboarding" moved here.
- **Location switch** (`lib/location.ts`): on = new sightings save a place name ("City, Region",
  or coordinates if offline). Turning it on asks for permission; if the phone has refused for good, a
  pop-up offers Open Settings. The choice is kept per phone (meta table); until flipped it follows the
  phone's permission. The result screen looks the place up while the user reads, and Confirm waits at
  most 2.5 s for it.
- **Delete account:** confirm pop-up (sad docent) → `app/api/delete-account+api.ts` removes the
  user's photos from storage, then the auth user; the database cascade removes profile, sightings
  and chats. The app then signs out (fresh anonymous account, local data cleared) and restarts
  onboarding. Tested against Supabase with a throwaway account.
- Shared: `Wash` (the orange/lime card wash, also used by the reward pop-up now), icons
  `FilterIcon`, `LockIcon`, `SpeciesStatIcon`, `CaptureStatIcon`, `LogoutIcon`, `TrashIcon`; tokens
  `dayPill`, `wash`, `destructive*`, `chevron`.
- `/dev/home?screen=home|empty|profile|profile-signed-in` previews both screens with sample data.

## What Species detail + Ask chat added

Figma: species-Details `88384:3654`, species-Details-Ask `88384:3692`, -ifNotReleventQuestion `88384:3751`.

- **Species page** (`components/species/SpeciesView.tsx`, used by `app/species/[id].tsx`): photo with the
  round back button over it, name + scientific name, category and sighting pills, description, the
  date/location card, "Ask about this …" field pinned at the bottom (opens the chat). It is now a
  normal pushed screen (was a modal), as in Figma.
- **Edit date / place** (`EditSightingPopups.tsx`, not in Figma — only the edit icons are): a month
  calendar (no future days) and a free-text place field (empty = "Location not recorded").
  `db.editSighting()` changes the first sighting's date, or the place on the sighting that is shown
  (the first one if none has a place); the change goes out through the existing `sighting.insert`
  outbox job (an upsert), so no new sync code or Supabase change. Changing a date can move the
  streak/XP, since those come from sighting dates. **Limit:** another phone already signed in to the
  same account won't pick up the edit (sync only pulls *new* sightings); a fresh sign-in does.
- **Ask chat** (`components/species/AskView.tsx`, used by `app/ama/[id].tsx`, still a sheet over the
  species page): grabber, close cross, title, docent avatar = the user's chosen docent, cream user
  bubbles, white answers, animated three-dot typing bubble, error box above the field. The docent
  opens every chat with a greeting (not stored).
- **Off-topic answers:** `app/api/ama+api.ts` now asks OpenAI for JSON `{answer, off_topic}` and
  returns `offTopic`; such answers get Figma's red wash + red dot. Remembered for the visit only (the
  stored chat has no column for it), and an off-topic question still counts for chat XP.
- Shared: icons `CalendarIcon`, `LocationIcon`, `EditIcon`; tokens `sheet`, `grabber`, `chatUser`,
  `chatOffTopic`, `typingDot`.
- `/dev/species?screen=species|ask|ask-empty|ask-off-topic|ask-error` previews each state.

## Open items / decisions for later chats

- **Figma access:** now on a Full seat, so there's no tight call limit. The page listing only
  returns the Cover page, so ask the user for a node link per screen.
- **Location pop-up** in `app/onboarding/first-capture.tsx` predates `Popup`; switch it over when
  touched next.
- **Lens switcher** needs a check on a real iPhone (labels 0.5 / 3 are Figma's; a 2× or 5×
  telephoto still says 3).
- **Placeholder colour.** Figma draws input placeholders in full dark; `Input` uses 60% so typed
  text and hints look different. Revisit if the designer wants the exact Figma look.
- **Location pop-up copy** is the designer's draft ("only used while the app is in use only for
  your better experience…"); worth a tidy with the designer.
- **Preview pane can't sign in:** the in-app browser can't reach Supabase, so normal screens sit
  on the "WildPack" cover there. Use `/dev/components`, a phone, or a regular browser.
- **Badge names / XP numbers** are ours apart from "Safari Starter" — worth a look with the designer.
- **Not tried yet:** a real capture with Location on (the place lookup), and Delete account from the
  app itself (the server route was tested directly).
- **Avatar.tsx** (old emoji looks) is now only used for `DEFAULT_LOOK`; tidy when convenient.
- **Species page / chat to try on the Simulator:** the chat sheet over a pushed species page, the
  keyboard pushing the chat field up, and editing date/place on a real sighting.
- Design gaps still to ask about when reached: loading/error states. Off-topic copy is the AI's own
  wording; the edit pop-ups are ours — worth showing the designer.
