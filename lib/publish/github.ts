import fs from "fs";
import path from "path";

export type CommitFile = {
  path: string;
  content: string;
};

export type CommitResult = {
  sha: string;
  branch: string;
  dryRun: boolean;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function resolveRepo(): { owner: string; repo: string } {
  const explicit = process.env.GITHUB_REPO?.trim();
  if (explicit) {
    const [owner, repo] = explicit.split("/");
    if (!owner || !repo) throw new Error("GITHUB_REPO must be owner/repo");
    return { owner, repo };
  }

  const owner =
    process.env.VERCEL_GIT_REPO_OWNER?.trim() ||
    process.env.GITHUB_REPOSITORY_OWNER?.trim();
  const repo =
    process.env.VERCEL_GIT_REPO_SLUG?.trim() ||
    process.env.GITHUB_REPOSITORY?.trim()?.split("/")[1];

  if (!owner || !repo) {
    throw new Error(
      "Set GITHUB_REPO=owner/repo (or ensure Vercel git env vars are present)."
    );
  }
  return { owner, repo };
}

function resolveBranch(): string {
  return (
    process.env.GITHUB_CONTENT_BRANCH?.trim() ||
    process.env.GITHUB_BRANCH?.trim() ||
    "main"
  );
}

function isDryRun(): boolean {
  return process.env.PUBLISH_DRY_RUN === "1" || process.env.PUBLISH_DRY_RUN === "true";
}

async function githubRequest<T>(
  apiPath: string,
  init?: RequestInit
): Promise<T> {
  const token = requireEnv("GITHUB_TOKEN");
  const res = await fetch(`https://api.github.com${apiPath}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status} ${apiPath}: ${text.slice(0, 500)}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Write files locally (dry-run) or commit atomically to GitHub. */
export async function publishFiles(
  files: CommitFile[],
  message: string
): Promise<CommitResult> {
  if (isDryRun()) {
    for (const file of files) {
      const full = path.join(process.cwd(), file.path);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, file.content, "utf8");
    }
    return { sha: "dry-run", branch: resolveBranch(), dryRun: true };
  }

  const { owner, repo } = resolveRepo();
  const branch = resolveBranch();

  const ref = await githubRequest<{ object: { sha: string } }>(
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`
  );
  const baseCommitSha = ref.object.sha;

  const baseCommit = await githubRequest<{ tree: { sha: string } }>(
    `/repos/${owner}/${repo}/git/commits/${baseCommitSha}`
  );

  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await githubRequest<{ sha: string }>(
        `/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({
            content: Buffer.from(file.content, "utf8").toString("base64"),
            encoding: "base64",
          }),
        }
      );
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.sha,
      };
    })
  );

  const tree = await githubRequest<{ sha: string }>(
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseCommit.tree.sha,
        tree: blobs,
      }),
    }
  );

  const commit = await githubRequest<{ sha: string }>(
    `/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    }
  );

  await githubRequest(`/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  return { sha: commit.sha, branch, dryRun: false };
}

export function todayUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}
