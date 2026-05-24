# ShipGotchi Planning Index

Date: 2026-05-22
Challenge: Dollar Vibe Club 24-Hour Open Build Sprint
Track: Vibe Gotchi
Builder: Solo, full-stack
Host: Vercel

## Build Decisions (locked)

- **Solo execution.** No multi-person parallelism. The five workstreams in the execution plan run sequentially on a single critical path, optionally orchestrated as AI subagents.
- **Vercel hosting** with a serverless GitHub proxy. The proxy is **required, not optional** (see Technical Plan) — it is the single biggest defense against a dead live demo from rate limits.
- **Layered sprite system** (one base mascot + state-driven layers) is the primary art approach. Independently AI-generated variants are a stretch goal, not a dependency.
- **Build folder:** `C:\Code\Challenge`.

## Strategic Decision

Build **ShipGotchi**: a no-login, mobile-first webapp where a visitor enters any public GitHub username and instantly hatches a premium digital pet whose mood, evolution, outfit, and Builder DNA are based on recent public GitHub activity.

The goal is to win the judging demo and make the build feel like something DVC would want to co-build after the sprint.

## Planning Pack

1. [Product Brief](./01-product-brief.md)
2. [MVP Specification](./02-mvp-specification.md)
3. [Experience And Visual Direction](./03-experience-visual-direction.md)
4. [Technical Plan](./04-technical-plan.md)
5. [Execution Plan And Agent Workstreams](./05-execution-plan-agent-workstreams.md)
6. [Judging Demo And Submission Kit](./06-judging-demo-submission-kit.md)
7. [Prompt Runbook](./07-prompt-runbook.md)
8. [Sprite Asset Prompts](./08-sprite-asset-prompts.md)

## Winning Angle

Most entries will either be over-scoped or too generic. ShipGotchi should win by being:

- Instant: no login, no setup, no tutorial.
- Emotional: the pet is the product, not a dashboard decoration.
- Streamable: judges can paste a username and get a fun reveal in seconds.
- Robust: GitHub public APIs, sample users, and graceful fallbacks keep the demo alive.
- Launchable: the long-term vision is a persistent builder companion that grows as you ship.

## MVP Mantra

Paste your GitHub. Meet the creature your commits created.

