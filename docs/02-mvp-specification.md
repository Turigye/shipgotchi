# ShipGotchi MVP Specification

## MVP Goal

Deliver a polished, mobile-first webapp that produces a delightful result from any public GitHub username within 10 seconds.

## Core Flow

1. User lands on ShipGotchi.
2. User enters a GitHub username or taps a sample username.
3. App fetches public GitHub profile, repos, and events.
4. Loading ritual plays: "Scanning commit aura..."
5. Pet hatches with animation.
6. User sees pet, mood, level, evolution, outfit, and Builder DNA.
7. User can add more usernames to compare pets locally.
8. User can generate a polished share card.

## Feature 1: GitHub Hatch

### User Story

As a visitor, I want to paste any public GitHub username so I can instantly hatch a pet without logging in.

### Requirements

- Single prominent input on first screen.
- Sample usernames available as quick chips.
- Fetch public GitHub data:
  - User profile
  - Recent public events
  - Public repositories
- Fetch via our own `/api/github` proxy (authenticated token + caching), never the GitHub API directly. See Technical Plan.
- Show a premium loading state while data loads.
- Handle invalid usernames gracefully.
- Handle GitHub rate-limit or network failure with sample/demo data fallback (backstop only — the proxy is the primary defense).

### Acceptance Criteria

- A judge can type a username and get a result without account creation.
- Empty, invalid, and rate-limited states do not break the UI.
- A sample username can produce a successful demo even if GitHub is unavailable.

## Feature 2: Pet Mood And Evolution

### User Story

As a visitor, I want the pet to visibly reflect the user's shipping activity so the result feels personal.

### Inputs

- Recent push events
- Recent repository updates
- Top languages
- Account age
- Public repo count
- Recent event recency

### Simple Scoring Model

Shipping Energy:

- High: multiple push/repo events in the last 7 days
- Medium: some activity in the last 30 days
- Low: no recent activity

Evolution Level:

- Egg: sparse or new account
- Sprout: low-to-medium activity
- Builder: consistent recent activity
- Overclocked: high recent activity
- Sleepy: quiet account

Mood:

- Hyped: active in last 24 hours
- Focused: active this week
- Curious: diverse languages/repos
- Sleepy: inactive for 30+ days
- Ancient Sage: old account with deep repo history

### Acceptance Criteria

- Pet state changes for different usernames.
- Mood and evolution are explained in plain language.
- The scoring system is deterministic and fast.

## Feature 3: Premium Sprite Moment

### User Story

As a visitor, I want the pet reveal to feel premium and emotional.

### Requirements

- One mascot species, rendered as **one base + state-driven layers** (body tint, expression, accessory, motion) — not 7 independently generated images. See Visual Direction "Sprite Strategy."
- Variants map to evolution/mood states.
- Art direction: cute premium toy, soft digital collectible, light builder-lab UI accents.
- Avoid requiring runtime AI image generation.
- Prefer SVG/CSS sprite components for guaranteed character consistency; pre-generated AI renders are an optional swap-in once MVP is stable.

### Recommended Sprite Set

- Egg
- Sprout
- Builder
- Overclocked
- Sleepy
- Error/Mystery fallback
- Optional: language outfit overlays

### Acceptance Criteria

- Pet is the visual centerpiece.
- Variants are visibly different.
- The result still works if images load slowly or fail.

## Feature 4: Builder DNA Card

### User Story

As a visitor, I want a stylish identity card that summarizes my builder personality.

### Card Contents

- GitHub avatar and username
- ShipGotchi pet
- Builder class
- Level
- Mood
- Evolution stage
- Top language
- Estimated streak/activity signal
- One memorable personality line

### Builder Class Examples

- Midnight Shipper
- Stack Alchemist
- Pixel Mechanic
- Patch Saint
- Launch Goblet
- Refactor Monk
- Repo Ranger
- Bug Whisperer
- Syntax Sprinter

### Tone

Playful, affirming, slightly witty, never mean. The best copy feels like a fortune cookie for developers.

### Acceptance Criteria

- The card is readable on mobile.
- The card makes the user want to screenshot/share.
- The card lists enough details that judges can see the GitHub data was used.

## Feature 5: Compare / Party Mode

### User Story

As a visitor, I want to compare multiple GitHub users so the product becomes replayable and stream-friendly.

### Requirements

- Add up to four usernames in one session.
- Show pets side-by-side.
- Highlight differences:
  - Highest energy
  - Sleepiest pet
  - Most languages
  - Most ancient account
- Store only in browser/session state.

### Acceptance Criteria

- Judges can compare sample users quickly.
- No backend persistence is required.
- Mobile layout remains usable.

## Optional Nice-To-Have

Desk Mode:

- Pet docks in the bottom-right corner of the web page.
- Pet can be dragged within the page.
- This hints at the future desktop companion without violating the webapp-only rule.

Desk Mode should be added only after the five MVP features are stable.

