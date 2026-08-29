import { NextResponse } from "next/server";

import { submitMockClaim } from "@/lib/demo/mock-claim-submission-service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
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
