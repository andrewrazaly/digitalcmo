import { NextResponse } from "next/server";
import { AuthError, assertCronAuthorized } from "@/lib/publish/auth";
import { publishFiles } from "@/lib/publish/github";
import { runIdeation, TOPIC_QUEUE_PATH } from "@/lib/topics/ideate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

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
  const force = url.searchParams.get("force") === "1";

  try {
    const result = await runIdeation({ force });

    if (!result.skipped) {
      await publishFiles(
        [{ path: TOPIC_QUEUE_PATH, content: result.queueJson }],
        `chore(content): ideation enqueue ${result.addedCount} topics`
      );
    }

    return NextResponse.json({
      ok: true,
      result: {
        skipped: result.skipped,
        reason: result.reason,
        addedCount: result.addedCount,
        queuedCount: result.queuedCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
