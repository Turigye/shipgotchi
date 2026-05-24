# ShipGotchi Execution Plan And Agent Workstreams

## Build Strategy

We plan heavily, then execute. The product is small enough to complete in 24 hours, but polished enough to win if the workstreams stay focused.

**Solo note:** this is a single full-stack builder, so there is no human parallelism. The five workstreams below are a way to *organize* the work, not five people. Run them as one sequential critical path, or hand individual workstreams to AI subagents that you orchestrate. The timeline below is the sequential reality.

## Recommended Timeline

### Hour 0-2: Setup, Skeleton, And Live URL

- Scaffold Next.js + TypeScript + Tailwind app.
- **Deploy the empty scaffold to Vercel immediately** so a live URL exists from hour 1; every later change just ships to it.
- **Build the `/api/github` proxy** (authenticated token + ~5min cache) and set `GITHUB_TOKEN` in Vercel env. This is the reliability backbone — do it before the UI.
- Set up design tokens and responsive shell.
- Create the client fetch service that calls `/api/github` (not GitHub directly).
- Create sample data.
- Establish pet scoring types.

### Hour 2-6: Core Loop

- Username input.
- Sample users.
- GitHub fetch.
- Scoring logic.
- Result page.
- Error and fallback states.

### Hour 6-10: Visual Payoff

- Pet sprites/variants.
- Hatch animation.
- Builder DNA card.
- Premium mobile layout.
- Copywriting pass.

### Hour 10-14: Compare Mode

- Add up to four users.
- Local session state.
- Side-by-side pet cards.
- Comparison highlights.

### Hour 14-18: Polish And Demo

- Share card UI.
- Desk Mode if core features are stable.
- Mobile QA.
- Loading ritual.
- Empty/error states.

### Hour 18-21: Hardening

- Test GitHub API failures.
- Test invalid usernames.
- Test mobile layout.
- Test production deployment.
- Verify no login required.

### Hour 21-24: Submission

- Final deploy.
- Create cover image.
- Write 500-character description.
- Optional short YouTube demo.
- Submit production URL.

## Workstreams (solo critical path, or AI subagents you orchestrate)

These are organizational buckets, not five people. Sequence them; optionally delegate a bucket to a subagent.

### Workstream 1: Core Data And Scoring

Owns:

- `/api/github` serverless proxy (authenticated token + cache)
- GitHub API client (client side, calls the proxy)
- Sample data
- Activity normalization
- Energy score
- Evolution stage
- Builder class
- Error fallbacks

Deliverables:

- `GET /api/github?username=` proxy route (token + cache, maps statuses to UI states)
- `getGithubUser(username)` (client; calls the proxy)
- `normalizeGithubActivity(data)`
- `createPetProfile(activity)`
- Test fixtures for active, inactive, invalid, and sample users

### Workstream 2: Frontend Experience

Owns:

- Landing screen
- Username input
- Hatch button
- Loading ritual
- Result layout
- Mobile responsiveness

Deliverables:

- Complete core user flow
- No-login path
- Sample username chips
- Empty/loading/error/result states

### Workstream 3: Sprite And Visual System

Owns:

- Mascot art direction
- Pet variants
- Sprite component
- Mood/evolution display
- Animation states

Deliverables:

- Egg, Sprout, Builder, Evolved, Overclocked, Sleepy, Mystery variants
- Lightweight animations
- Asset fallback strategy

### Workstream 4: Builder DNA And Copy

Owns:

- Builder classes
- Personality lines
- Mood labels
- Loading copy
- Submission description
- Demo script

Deliverables:

- Copy map keyed by mood/stage/language
- Builder DNA card content
- 500-character submission copy
- Judge demo script

### Workstream 5: QA, Deploy, And Submission

Owns:

- Production deploy
- Mobile QA
- Browser checks
- API failure checks
- Submission asset checklist

Deliverables:

- Public URL
- Smoke test report
- Mobile screenshots
- Submission-ready checklist

## Integration Contracts

### PetProfile Contract

All UI should consume a single `PetProfile` object rather than raw GitHub API data.

Fields:

- username
- avatarUrl
- githubUrl
- level
- mood
- evolutionStage
- builderClass
- topLanguage
- energyScore
- activitySummary
- personalityLine
- spriteVariant
- outfitTrait

### UI State Contract

States:

- idle
- loading
- success
- compare
- notFound
- rateLimited
- networkError

## Feature Freeze Rule

After the core five features work, no new product features should be added unless:

- production deployment is already stable,
- mobile is already verified,
- invalid/rate-limited states work,
- and the feature improves the judging demo within 30 minutes.

## Cut List If Time Gets Tight

Cut in this order:

1. Desk Mode
2. Share card export/download
3. Outfit overlays
4. Comparison highlight awards
5. Advanced language fetching

Never cut:

- GitHub hatch
- Pet state changes
- Builder DNA card
- Sample demo path
- Mobile-friendly layout

