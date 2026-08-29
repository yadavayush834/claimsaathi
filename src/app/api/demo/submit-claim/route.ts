import { NextResponse } from "next/server";

import { submitMockClaim } from "@/lib/demo/mock-claim-submission-service";
import { detectSensitivePii } from "@/lib/safety/pii-detector";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const candidate = body as {
      treatmentNeed?: unknown;
      fictionalCity?: unknown;
    };
    const piiDetection = detectSensitivePii(
      `${typeof candidate.treatmentNeed === "string" ? candidate.treatmentNeed : ""} ${typeof candidate.fictionalCity === "string" ? candidate.fictionalCity : ""}`,
    );

    if (piiDetection.hasPii) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Remove sensitive identifiers or credentials. This demo accepts fictional details only.",
        },
        { status: 400 },
      );
    }

    const result = submitMockClaim(body);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload format." },
      { status: 400 },
    );
  }
}
