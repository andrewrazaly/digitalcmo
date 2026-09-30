import { NextResponse } from "next/server";
import { AuthError, assertCronAuthorized } from "@/lib/publish/auth";
import { runPublishJob } from "@/lib/publish/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function handle(request: Request) {
  try {
    assertCronAuthorized(request);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status }
      );
    }
    throw error;
  }

  const url = new URL(request.url);
  const topicHint = url.searchParams.get("topic") || undefined;
  const force = url.searchParams.get("force") === "1";

  const result = await runPublishJob({ topicHint, force });

  // Expected operational outcomes (skip / QA fail) return 200 so cron does not thrash.
  const httpStatus =
    result.status === "failed" &&
    result.reason &&
    !result.reason.startsWith("Quality gates")
      ? 500
      : 200;

  return NextResponse.json(
    {
      ok: result.status === "published" || result.status === "dry_run",
      result,
    },
    { status: httpStatus }
  );
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
