import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { heavyWaste, plasterboard, plasterboardOption } = body;

  if (typeof heavyWaste !== "boolean") {
    return NextResponse.json(
      { error: "heavyWaste is required" },
      { status: 400 },
    );
  }

  if (
    plasterboard &&
    !["separate", "mixed", "collection"].includes(plasterboardOption)
  ) {
    return NextResponse.json(
      { error: "Invalid plasterboardOption" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
