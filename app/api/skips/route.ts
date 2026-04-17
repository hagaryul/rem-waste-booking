import { NextRequest, NextResponse } from "next/server";

const SKIPS_GENERAL = [
  { size: "4-yard", price: 120, disabled: false },
  { size: "6-yard", price: 150, disabled: false },
  { size: "8-yard", price: 180, disabled: false },
  { size: "10-yard", price: 220, disabled: false },
  { size: "12-yard", price: 260, disabled: false },
  { size: "14-yard", price: 310, disabled: false },
  { size: "16-yard", price: 370, disabled: false },
  { size: "20-yard", price: 450, disabled: false },
];

const SKIPS_HEAVY = [
  { size: "4-yard", price: 120, disabled: false },
  { size: "6-yard", price: 150, disabled: false },
  { size: "8-yard", price: 180, disabled: false },
  { size: "10-yard", price: 220, disabled: false },
  { size: "12-yard", price: 260, disabled: true },
  { size: "14-yard", price: 310, disabled: true },
  { size: "16-yard", price: 370, disabled: false },
  { size: "20-yard", price: 450, disabled: false },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const heavyWaste = searchParams.get("heavyWaste") === "true";

  const skips = heavyWaste ? SKIPS_HEAVY : SKIPS_GENERAL;

  return NextResponse.json({ skips });
}
