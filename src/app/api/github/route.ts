// Serverless GitHub proxy. The ONLY thing that touches api.github.com.
// - Uses GITHUB_TOKEN if present (60/hr -> 5,000/hr). Works without it.
// - ~5 min in-memory cache (per warm lambda) to conserve quota during judging.
// - Maps GitHub statuses to our UI states; never leaks raw errors.

import { normalizeActivity, normalizeProfile } from "@/lib/normalize";
import type { RawEvent, RawRepo, RawUser } from "@/lib/normalize";
import type { GithubFetchResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; body: GithubFetchResult }>();

function ghFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ShipGotchi",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`https://api.github.com${path}`, { headers, cache: "no-store" });
}

function json(body: GithubFetchResult, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}

export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("username")?.trim();
  if (!username) {
    return json({ state: "notFound", message: "No username provided." }, 400);
  }

  const key = username.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return Response.json(hit.body);
  }

  try {
    const userRes = await ghFetch(`/users/${encodeURIComponent(username)}`);

    if (userRes.status === 404) {
      return json(
        {
          state: "notFound",
          message:
            "That GitHub user did not hatch. Check the spelling or try a sample builder.",
        },
        404,
      );
    }
    if (userRes.status === 403 || userRes.status === 429) {
      return json(
        {
          state: "rateLimited",
          message:
            "GitHub is making us wait. Try a sample hatch while the tiny servers cool down.",
        },
        429,
      );
    }
    if (!userRes.ok) {
      return json(
        { state: "networkError", message: "GitHub hiccuped. Try again or use a sample." },
        502,
      );
    }

    const rawUser = (await userRes.json()) as RawUser;
    const [eventsRes, reposRes] = await Promise.all([
      ghFetch(`/users/${encodeURIComponent(username)}/events/public?per_page=100`),
      ghFetch(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20&type=owner`),
    ]);

    const events = (eventsRes.ok ? await eventsRes.json() : []) as RawEvent[];
    const repos = (reposRes.ok ? await reposRes.json() : []) as RawRepo[];

    // Fallback commit messages: the public events feed often returns
    // PushEvent with `commits: []` for fresh pushes (GitHub propagation
    // lag). Pull messages directly from the top 2 owned recently-pushed
    // repos so the commit-vibe classifier always has signal. Best-effort —
    // any failure here is silently ignored.
    const recentOwnedRepos = repos
      .filter((r) => !r.fork && r.pushed_at)
      .slice(0, 2);

    type RawRepoCommit = { commit?: { message?: string } };
    const commitBatches = await Promise.all(
      recentOwnedRepos.map((r) =>
        ghFetch(
          `/repos/${encodeURIComponent(username)}/${encodeURIComponent(
            r.name,
          )}/commits?per_page=20`,
        )
          .then((res) =>
            res.ok ? (res.json() as Promise<RawRepoCommit[]>) : [],
          )
          .catch(() => [] as RawRepoCommit[]),
      ),
    );

    const fallbackMessages: string[] = [];
    for (const batch of commitBatches) {
      for (const c of batch) {
        const msg = c?.commit?.message;
        if (msg) fallbackMessages.push(msg);
      }
    }

    const profile = normalizeProfile(rawUser);
    const activity = normalizeActivity(
      events,
      repos,
      profile.createdAt,
      Date.now(),
      fallbackMessages,
    );
    const body: GithubFetchResult = { state: "success", profile, activity };

    cache.set(key, { at: Date.now(), body });
    return json(body, 200);
  } catch {
    return json(
      { state: "networkError", message: "Could not reach GitHub. Try a sample hatch." },
      502,
    );
  }
}
