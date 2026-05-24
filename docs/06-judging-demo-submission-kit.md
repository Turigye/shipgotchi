# ShipGotchi Judging Demo And Submission Kit

## Demo Goal

Make judges understand the app in 10 seconds and smile within 30 seconds.

## Demo Script

1. Open ShipGotchi on mobile or desktop.
2. Say: "No login. Paste any public GitHub username."
3. Click a sample username.
4. Hatch animation plays.
5. Pet appears with mood, evolution, Builder DNA, and personality line.
6. Add another sample username to Compare Mode.
7. Show different pet states side-by-side.
8. End on the share/result card.

## Three Features To List In Submission

1. GitHub username hatch: fetches public GitHub activity and creates a pet.
2. Activity-based pet evolution: mood, level, stage, outfit, and class change based on shipping energy.
3. Builder DNA and Compare Mode: polished identity card plus local side-by-side pet comparison.

## Suggested Project Name

ShipGotchi

## Suggested Tagline

Paste your GitHub. Meet the creature your commits created.

## 500-Character Submission Description

ShipGotchi turns any public GitHub username into a living builder pet. Paste a username, hatch a premium digital companion, and see its mood, evolution, level, outfit, and Builder DNA based on recent public GitHub activity. Compare friends locally, try sample builders with no login, and generate a shareable result card. It is a playful first step toward a persistent companion that grows as you ship.

Character count: 397

## Tags

- github
- toy
- builder
- ai
- game
- no-login
- mobile
- devtools
- social
- dvc

## Cover Image Direction

Composition:

- Large cute ShipGotchi mascot in center.
- GitHub username input behind or below.
- Builder DNA card peeking from side.
- Text: "Paste your GitHub. Hatch your ShipGotchi."

Mood:

- Bright premium toy.
- Soft glow.
- Mobile app screenshot feel.
- Avoid dark cyberpunk.

## Judge Test Checklist

- Production URL loads publicly.
- No login is required.
- Input accepts a real GitHub username.
- Sample usernames work.
- Invalid username state works.
- Result shows pet state based on GitHub data.
- Result includes Builder DNA card.
- Compare Mode works.
- Mobile layout works.
- The app remains usable if GitHub API fails or rate-limits.

## Recommended Sample Users

Use public, high-signal usernames for demo chips. Verify before launch.

- torvalds
- gaearon
- sindresorhus
- yyx990803

Add at least one bundled sample data profile so the demo works even if GitHub rate-limits.

## Final Submission Safety

Before submitting:

- Confirm project URL is production (Vercel), not localhost.
- Confirm GITHUB_TOKEN is set in Vercel env and the /api/github proxy returns live data in production.
- Confirm the sample-data backstop still produces a full demo if GitHub/proxy fails.
- Confirm cover image is uploaded.
- Confirm description lists the working features.
- Confirm no required auth wall.
- Confirm URL will stay public through judging.
- Confirm mobile view is clean.

