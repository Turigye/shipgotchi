# ShipGotchi Technical Plan

## Recommended Stack (locked: solo + Vercel)

- **Next.js + TypeScript** — chosen over Vite specifically so the GitHub proxy (below) lives in the same project as `app/api/*` routes, with zero extra deploy config on Vercel.
- Tailwind CSS for fast, consistent styling.
- All GitHub data fetched **through our own serverless proxy**, not directly from the browser.
- **Vercel** deployment (Git-connected, auto-deploy on push).

The sprint prioritizes speed, polish, and reliability over backend complexity. The one piece of backend we DO build — the proxy — exists purely to keep the live demo alive.

## Data Sources

GitHub public REST API (called server-side from our proxy, never directly from the browser):

- `GET https://api.github.com/users/{username}`
- `GET https://api.github.com/users/{username}/events/public`
- `GET https://api.github.com/users/{username}/repos?sort=updated&per_page=20`

Optional:

- Repo language URLs returned by repo objects, if time allows.

## GitHub Proxy (REQUIRED — build in Hour 0-2)

Why this is not optional: the unauthenticated GitHub REST API allows only **60 requests/hour per IP**. Our flow uses ~3 calls per username; a single 4-way Compare burns ~12. During live mobile judging, repeated tests — and multiple viewers behind the same network/IP — will exhaust 60 quickly, then every real fetch fails. A proxy with an authenticated token raises the ceiling to **5,000 requests/hour** and lets us cache.

Design:

- Single route: `GET /api/github?username={username}`.
- The route reads a `GITHUB_TOKEN` from Vercel environment variables (a fine-grained PAT with public read scope — no special permissions needed).
- The route makes the 3 GitHub calls server-side, normalizes them, and returns one combined payload (or a clean typed error).
- **Cache** responses for ~5 minutes (in-memory per warm lambda, or `Cache-Control` headers / a tiny edge cache). Repeated demo hits on the same username cost zero GitHub quota.
- The token is **never** exposed to the client. The browser only ever talks to `/api/github`.
- The route maps GitHub statuses to our UI states: 404 → `notFound`, 403/rate-limit → `rateLimited`, network/5xx → `networkError`.

The bundled sample data (see scoring/error handling) remains the final safety net if the proxy itself is unavailable. Proxy = primary reliability; sample data = backstop.

## Data Model

### GitHubProfile

- login
- name
- avatarUrl
- publicRepos
- followers
- createdAt
- htmlUrl

### GitHubActivity

- recentPushCount
- recentEventCount
- lastActivityAt
- repoUpdateCount
- topLanguages
- activeDaysEstimate
- accountAgeYears

### PetProfile

- username
- displayName
- level
- mood
- evolutionStage
- builderClass
- topLanguage
- energyScore
- personalityLine
- spriteVariant
- outfitTrait

## Scoring Logic

Keep scoring understandable and deterministic.

### Energy Score

Start at 0.

- +30 if active in last 24 hours
- +20 if active in last 7 days
- +10 if active in last 30 days
- +5 per push event in recent public events, capped at 30
- +10 if repos updated recently
- +10 if public repo count is above 20
- +10 if more than 3 languages detected

Clamp score to 0-100.

### Evolution Stage

- 0-15: Egg or Sleepy
- 16-35: Sprout
- 36-65: Builder
- 66-85: Evolved
- 86-100: Overclocked

If last activity is older than 30 days, prefer Sleepy unless account age/repo history is very strong.

### Builder Class

Derive from:

- Top language
- Energy score
- Account age
- Repo diversity

Examples:

- High energy + TypeScript: Interface Sprinter
- High energy + Python: Script Sorcerer
- Old account + many repos: Ancient Maintainer
- Low recent activity + many repos: Sleeping Architect
- Diverse languages: Stack Alchemist

## Error Handling

### Invalid Username

Show Mystery pet and message:

"That GitHub user did not hatch. Check the spelling or try a sample builder."

### Rate Limited

Show:

"GitHub is making us wait. Try a sample hatch while the tiny servers cool down."

Then provide sample data path.

### Network Failure

Show retry and sample buttons.

### Private/No Activity

Use profile/repo data if events are sparse. Do not make the user feel punished.

## Performance

- Avoid runtime image generation.
- Preload key pet assets.
- Cache fetched users in memory/session storage.
- Keep first result under 10 seconds.
- Use skeleton/loading ritual instead of blank waiting.

## Deployment Requirements

- **Vercel**, Git-connected, auto-deploy on push to main. Get a live URL in Hour 0-2 (deploy the empty scaffold first, then keep shipping to it).
- Set `GITHUB_TOKEN` in Vercel project env vars before the proxy goes live.
- Public production URL.
- No login required.
- Mobile-friendly.
- Stable until judging completes.
- Demo sample usernames built into UI.

