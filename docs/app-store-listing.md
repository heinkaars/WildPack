# WildPack — App Store listing (draft for review)

Everything App Store Connect asks for, field by field, for version 1.0 (iPhone only,
bundle ID `com.heinkaars.wildpack`). Copy each block into the field with the same name.
Character counts were measured with a script. Facts about Apple's rules were checked on
2026-11-09; sources are listed at the end.

**Decided 2026-11-09:** support page at `/support.html` (in `public/`, live after the next
deploy), no marketing URL for now, place names labelled as Other User Content.
Teaser photos removed from the app, so content rights = No.
**Still open (marked ❓ below):** the age rating — the calculated 4+/9+ is the default.

---

## 1. App information (App Store Connect → App Information)

### Name — max 30, min 2
```
WildPack
```
8 characters. A web search found no other "WildPack" app; App Store Connect checks this for real
when you create the app. If it says the name is taken, use the fallback:
```
WildPack: Wildlife ID
```
(21 characters.)

### Subtitle — max 30
```
Snap, identify & learn animals
```
30 characters. Alternative: `Wildlife ID, quiz & life list` (29).

### Category
- **Primary: Education.** WildPack is about learning what you saw: identification with a short
  description, a guide you can ask questions, and a daily quiz on your own finds. Comparable
  apps (iNaturalist, Seek) sit in Education, and parents and teachers browse it.
- **Secondary: Reference.** Field-guide style apps (bird ID apps, for example) live here, so it
  catches people searching for a species guide.
- **Why not Lifestyle:** it is a catch-all with a lot of competition, and it says nothing about
  what WildPack does.

### Content rights
"Does your app contain, show, or access third-party content?" → **No.** The app shows the
user's own photos, its own artwork and AI-written text. The "Not found yet" teaser photos from
the Figma file were removed before release (2026-11-09) for this reason. Two of them remain only
as sample images for the `/dev/...` preview screens, which production builds redirect away from;
don't use those in store screenshots.

### Copyright
```
2026 Hein Kaars Sijpesteijn
```
(Apple adds the © itself.)

### Privacy Policy URL
```
https://wildpack.expo.app/privacy.html
```

---

## 2. Version page text (App Store Connect → iOS App → 1.0)

### Promotional text — max 170 (can be changed any time without a new build)
```
Spotted an animal? Snap it, find out what it is, and ask your guide anything about it. Build your life list, take the daily quiz and keep your streak going.
```
156 characters.

### Description — max 4000
```
Spotted something wild? Take a photo and WildPack tells you what it is.

WildPack turns every walk, garden visit or trip into a small adventure. Photograph a bird, a squirrel, a lizard or a butterfly, and get a name, its scientific name and a short description in seconds. Every animal you confirm goes into your own life list, so you can see everything you've found.

IDENTIFY WHAT YOU SEE
• Take a photo with the camera, or pick one you already took
• Get the species name, its scientific name and a short description
• See how sure WildPack is, and look through other possible matches if the first guess isn't right

BUILD YOUR LIFE LIST
• Every species you find is saved in your life list, with your own photos
• Spot the same animal again and add more photos to it
• Filter by birds, mammals, insects, reptiles, amphibians or fish, and sort the way you like
• Add the date and the place where you saw it

ASK YOUR GUIDE
Pick your own guide: a lion, a rhino, a gecko or a raccoon. Open any species and ask questions in a chat: What does it eat? Where does it live? How do I tell it apart from a look-alike? Your guide answers in plain, friendly language.

A DAILY QUIZ ABOUT YOUR FINDS
Every day there's a new five-question quiz about the animals in your own life list. Find the right answer and learn something new about the animals you've seen.

EARN XP, BADGES AND STREAKS
Earn XP for new species, repeat sightings, questions and quizzes. Unlock 13 badges along the way, from First Tracks to Wild Legend, and keep your streak alive by capturing wildlife or doing the quiz every day.

START RIGHT AWAY
No sign-up needed: open the app and start exploring. If you want to keep your life list when you switch phones, you can create an account with your email at any time.

YOUR PRIVACY
• No ads, and no tracking across other apps or websites
• WildPack doesn't use your location
• Identification and answers come from OpenAI. The app asks your permission before it sends a photo or a question there, and never sends your name or email
• You can delete your account and all your data from your profile at any time

Good to know: WildPack needs an internet connection to identify animals and answer questions. Identification is done by AI and can be wrong, so never rely on it to decide whether an animal is safe to approach or touch.

Questions or ideas? Write to hein.wildpack@gmail.com.
```
2,390 characters (well under 4,000; room to grow).

### Keywords — max 100 bytes, comma-separated, no spaces needed
```
wildlife,animal,identifier,species,bird,mammal,insect,reptile,nature,naturalist,quiz,safari,zoo
```
95 bytes. Apple's rules: each keyword longer than two characters, no other apps' or companies'
names, and no repeat of the app name (WildPack is already searchable, so "wildpack" isn't here).
Singular forms are enough; Apple matches plurals. "Identify" isn't needed next to
"identifier", and words already in the name or subtitle (snap, identify, learn, animals) count
towards search anyway, so they were left out to make room.

### Support URL — required
```
https://wildpack.expo.app/support.html
```
Apple requires a page that shows real contact information. `public/support.html` has the contact
email, four common questions (wrong ID, no connection, new phone, delete account) and a link to
the privacy policy. **It only works after the next deploy** (`npx expo export -p web && npx
eas-cli deploy --prod --environment production`); open the link once before submitting.

### Marketing URL — optional
Leave empty for 1.0 (decided). Can be added in any later update.

### Version / build
- Version: `1.0.0` (matches `app.json`).
- "What's New" isn't shown for a first version.

---

## 3. App Privacy ("nutrition label")

App Store Connect → App Privacy → Get Started. First answer:
**"Do you or your third-party partners collect data from this app?" → Yes.**

Then tick the data types below. For each, App Store Connect asks three things: the purpose,
whether it is linked to the user, and whether it is used for tracking.

**Tracking:** No for every item. WildPack has no ads, no analytics SDK and no data broker, and
never combines its data with other companies' data.

| Data type (Apple's name) | What it is in WildPack | Purpose | Linked to user? | Tracking? |
|---|---|---|---|---|
| **Contact Info → Email Address** | Only if the user creates an account with email (optional) | App Functionality | Yes | No |
| **Contact Info → Name** | The name chosen during onboarding (can be any nickname) | App Functionality | Yes | No |
| **User Content → Photos or Videos** | Wildlife photos, stored in Supabase and sent to OpenAI to identify | App Functionality | Yes | No |
| **User Content → Other User Content** | Ask chat questions, the species in the life list, dates, the guide picked | App Functionality | Yes | No |
| **User Content → Gameplay Content** | Daily quiz scores, streak (XP and badges are worked out from these) | App Functionality | Yes | No |
| **Identifiers → User ID** | The account ID Supabase creates on first launch | App Functionality | Yes | No |

**Why "App Functionality" for everything:** Apple's definition covers authentication, enabling
features, fraud prevention and security. Nothing is used for analytics, advertising,
personalisation or "other purposes". (The guide greeting the user by name is a feature, not
"Product Personalization", which is about recommendations.)

**IP address (rate limiting).** The server stores the caller's IP address next to a time stamp
for one minute, to block someone hammering the AI routes, and removes it after that. It is
stored in a separate row from the user ID. Apple only asks for an IP address that is retained
(one that is sent and not kept doesn't count) and has no "IP address" type of its own. Because
it is kept so briefly and only for security, **leave it off the label**; the privacy policy
already explains it. If you prefer to be extra careful, add it as **Identifiers → Device ID**,
App Functionality, Not linked — but that tends to confuse readers more than it helps.

**Place names (decided: Other User Content).** On a species page the user can type where they
saw an animal ("e.g. Vondelpark, Amsterdam"). That is free text the user writes, not the phone's
location, and WildPack never asks for location permission, so it is part of Other User Content
and the label shows no Location. (The stricter reading would add Coarse Location; not chosen,
because it would contradict "WildPack doesn't use your location".)

**Not collected (leave unticked):** Health & Fitness, Financial Info, Precise Location, Sensitive
Info, Contacts, Browsing History, Search History, Device ID, Purchases, Usage Data, Diagnostics
(no crash reporting SDK), Surroundings, Body, Audio.

**OpenAI.** Photos (for identification), Ask questions with the earlier chat and the species
name, and species names (for the quiz) go to OpenAI. They are already covered by the data types
above, because the label covers what "you or your third-party partners" collect. Apple's rule
5.1.2(i) (since November 2025) requires telling users and getting their explicit permission
before personal data goes to a third-party AI. WildPack does this with the consent pop-up before
the first photo or question (`components/AiConsentPopup.tsx`), and the privacy policy names
OpenAI. Mention it in the App Review notes too (section 5).

---

## 4. Age rating

App Store Connect → App Information → Age Rating → Edit. Suggested answers:

### In-app controls
| Question | Answer |
|---|---|
| Parental Controls | No |
| Age Assurance | No |

### Capabilities
| Question | Answer | Why |
|---|---|---|
| Unrestricted Web Access | No | No web browser in the app; the privacy link opens Safari |
| User-Generated Content | No | Photos and chats stay private to the user; nobody else sees them |
| Social Media | No | No feed, no other users |
| Messaging and Chat | No | Users can't contact each other; the Ask chat is with the AI guide only |
| Advertising | No | No ads |
| Shared Location *(new from 16 Nov 2026)* | No | Nothing is shared with other people |
| Dating and Relationships *(new from 16 Nov 2026)* | No | The guide is a wildlife expert, not a companion; it declines off-topic chat |

### Content (frequency: None / Infrequent / Frequent)
| Question | Answer |
|---|---|
| Profanity or Crude Humor | None |
| Horror/Fear Themes | None |
| Alcohol, Tobacco, or Drug Use or References | None |
| Medical or Treatment Information | None |
| Health or Wellness Topics | None |
| Mature or Suggestive Themes | None |
| Sexual Content or Nudity / Graphic Sexual Content | None |
| Cartoon or Fantasy Violence | None |
| Realistic Violence | **Infrequent** (see note) |
| Prolonged Graphic or Sadistic Realistic Violence | None |
| Guns or Other Weapons | None |
| Gambling / Simulated Gambling / Contests / Loot Boxes | No / None |

**Note on Realistic Violence:** a user can photograph a predator with its prey, and the guide
answers questions such as "what does a fox hunt?". That is nature, not violence for its own sake,
so "None" is also defensible. "Infrequent" is the careful choice and doesn't raise the rating
above 9+.

**About the AI chat.** Apple's July 2025 notice asks developers to "consider how all app
features, including AI assistants and chatbot functionality" affect how often sensitive content
can appear. The chat is free text, but it is limited in practice: the guide is told to answer
only about the species and wildlife, it declines other subjects (homework, coding, geography…)
and steers back, it can't search the web, and OpenAI's own safety filters apply. So the honest
answers above are None, not Frequent. The new "Dating and Relationships" declaration (in App
Store Connect from 16 Nov 2026, required for all apps by 12 Jan 2027) targets virtual companions
that engage in romantic or sexual content; WildPack's guide doesn't.

### Result and override ❓ (your decision, still open)
These answers give **4+** (or **9+** with Infrequent Realistic Violence). That calculated rating
is the default: under "Age Categories and Override" choose **Not Applicable** unless you decide
otherwise.

Optional: "Override to higher age rating" → 13+. This is only a suggestion, not a decision.
Points to weigh:
- The privacy policy's "Children" section was reworded on 2026-11-09 ("for nature lovers of all
  ages", younger children with a parent), so it now fits a 4+/9+ rating.
- An open text chat with an AI is something App Review can look at more carefully when the
  rating is low.
- Raising it hides the app from children whose parents set a stricter limit.

"Made for Kids" → **Not applicable**. Age Suitability URL → leave empty.

---

## 5. Screenshots

**Sizes (checked 2026-11-09):** Apple's page now lists **iPhone with Dynamic Island (medium
display)** as the required set (6.1"/6.3": 1206 × 2622 or 1179 × 2556), and the 6.9" set
(**1320 × 2868**, iPhone 17 Pro Max) is scaled down for the large-screen phones. To be safe and
look sharp everywhere, take each screenshot twice: once in the **iPhone 17 Pro Max** simulator
(1320 × 2868) and once in the **iPhone 17 Pro** simulator (1206 × 2622). Same screens, same order.
Max 10 per size; 6 is a good number. PNG or JPEG, no transparency, portrait.

**Order and caption ideas** (captions go on the image if you design frames around the
screenshots; the plain screenshot is fine too):

| # | Screen | Caption idea | How to get it with sample data (dev build) |
|---|---|---|---|
| 1 | Result after identifying (photo, name, confidence, description) | **Snap it. Know it.** | `/dev/capture?screen=result` |
| 2 | Home with life list, streak and XP bar | **Build your life list** | `/dev/home?screen=home` |
| 3 | Ask chat with the guide | **Ask your guide anything** | `/dev/species?screen=ask` |
| 4 | Daily quiz question | **A daily quiz about your finds** | `/dev/quiz?screen=quiz` |
| 5 | Reward pop-up (new species, XP, streak) | **Earn XP, badges and streaks** | `/dev/capture?screen=celebration` |
| 6 | Choose your guide (lion, rhino, gecko, raccoon) | **Pick your own guide** | `/dev/onboarding?screen=look` |

Optional extras: species page with several photos (`/dev/species?screen=species-captures`),
profile with stats (`/dev/home?screen=profile`).

Tips:
- The `/dev/...` routes only exist in dev builds. Open them in the iOS Simulator with a dev
  build (deep link `wildpack://dev/home?screen=home`), not in the web preview, so the frame and
  fonts are the real phone ones.
- Better still for 1–3: use real captures from your own phone (good animal photos sell the app).
  The dev sample is a raccoon on every screen.
- Apple rejects screenshots that show things the app doesn't do. Don't show the location
  pop-up or "nearby sightings".
- Set the simulator clock to 9:41 and full battery (`xcrun simctl status_bar booted override
  --time 9:41 --batteryLevel 100 --cellularBars 4`).

---

## 6. App Review information

**Sign-in required:** **No** (untick "Sign-in required"; no demo account needed).

**Contact information:** Hein Kaars Sijpesteijn, hein.wildpack@gmail.com, and your phone
number (you have it; it is deliberately not written here because this repository is public on
GitHub). Apple doesn't show it publicly.

**Notes** (paste into "Notes"):
```
Thank you for reviewing WildPack.

No login needed: on first launch the app creates an anonymous account automatically. Go through the short onboarding (pick a guide, type any name) and you can use every feature. Creating an account with email is optional (Profile > Create an account) and only needed to keep the life list on another phone; it sends a 6-digit code to the address you enter.

How to test identification:
1. Tap the camera button and take a photo of any animal, or tap the gallery button and choose any animal photo (a pet, a bird, or a picture of an animal on a screen works).
2. Before the first photo is sent, a pop-up asks permission to send photos and questions to OpenAI (guideline 5.1.2(i)). Tap Allow.
3. The result shows the species, confidence and other matches. Tap Confirm to add it to the life list.

Then: open the species from the life list and tap Ask to chat with the guide about it. After the first capture a Daily Quiz card appears on Home (5 questions about species in your life list). An internet connection is needed for identification, Ask and the quiz.

Location: WildPack does not use location and never asks for location permission. Users can optionally type a place name for a sighting.

Data and privacy: the camera and photo library are only used to identify wildlife. No ads, no tracking. Photos and questions go to OpenAI only after the user agrees in the pop-up; names and email addresses are never sent.

Delete account: tap your avatar on Home to open Profile, scroll down, tap Delete account and confirm. This removes the account, photos and all data from the server.

Contact: hein.wildpack@gmail.com
```

**Attachment:** none needed.

---

## 7. Pricing, availability and EU

- **Price:** Free (no in-app purchases, no subscriptions).
- **Availability:** all countries and regions, **except China mainland** (recommended): apps
  there that offer generative AI need a government licence, and App Review blocks them without
  one. Untick China mainland in Pricing and Availability.
- **EU Digital Services Act — trader status:** declare **"This is not a trader"** (decided: free
  hobby app, no income). Revisit if WildPack ever earns money (e.g. the parked docent shop).
  Apple then shows no trader contact details on the EU product page.
- **Tax / agreements:** none needed for a free app beyond the Free Apps agreement, which is
  accepted with the developer account.
- **Pre-orders:** No. **Release:** "Manually release this version" is the safe choice, so you can
  pick the moment after approval.
- **Accessibility Nutrition Labels** (optional for now): can be skipped for 1.0.

---

## Sources (checked 2026-11-09)

- Apple, *App information* (name 2–30, subtitle 30):
  https://developer.apple.com/help/app-store-connect/reference/app-information/app-information
- Apple, *Platform version information* (promo text 170, description 4000, keywords 100 bytes,
  support URL must show contact info, marketing URL optional):
  https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information
- Apple, *Screenshot specifications*:
  https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
- Apple, *App privacy details* (data types, purposes, linked, tracking, transient IP):
  https://developer.apple.com/app-store/app-privacy-details/
- Apple, *Age ratings values and definitions*:
  https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions
- Apple, *Set an app age rating* (override, Made for Kids):
  https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating
- Apple news, *Updated age ratings in App Store Connect* (AI chatbots, July 2025):
  https://developer.apple.com/news/?id=ks775ehf
- Apple news, *Upcoming: New age rating content descriptors* (Dating and Relationships,
  Shared Location; 16 Nov 2026, deadline 12 Jan 2027): https://developer.apple.com/news/?id=yxkh08us
- Guideline 5.1.2(i) and third-party AI (Nov 2025):
  https://developer.apple.com/news?id=ey6d8onl and
  https://techcrunch.com/2025/11/13/apples-new-app-review-guidelines-clamp-down-on-apps-sharing-personal-data-with-third-party-ai
