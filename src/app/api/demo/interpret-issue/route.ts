import { NextResponse } from "next/server";

import type { InterpretationRequest } from "@/lib/ai/interpreter-model";
import { interpretClaimIssue } from "@/lib/ai/openai-interpreter-service";
import { detectSensitivePii } from "@/lib/safety/pii-detector";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request payload format." },
        { status: 400 },
      );
    }

    const candidate = body as Partial<InterpretationRequest>;

    if (
      typeof candidate.rawStatusText !== "string" ||
      !candidate.rawStatusText.trim()
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide a portal remark or status text to interpret.",
        },
        { status: 400 },
      );
    }

    if (detectSensitivePii(candidate.rawStatusText).hasPii) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Remove sensitive identifiers or credentials. They are not accepted by this demo.",
        },
        { status: 400 },
      );
    }

    const interpretation = await interpretClaimIssue({
      rawStatusText: candidate.rawStatusText.trim(),
      context: candidate.context,
    });

    return NextResponse.json(
      {
        ok: true,
        interpretation,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to process interpretation request." },
      { status: 500 },
    );
  }
}
