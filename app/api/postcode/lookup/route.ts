import { NextRequest, NextResponse } from "next/server";
import { bookingStore } from "@/lib/store";

const POSTCODE_DATA: Record<
  string,
  { id: string; line1: string; city: string }[]
> = {
  SW1A1AA: [
    { id: "addr_1", line1: "10 Downing Street", city: "London" },
    { id: "addr_2", line1: "12 Downing Street", city: "London" },
    { id: "addr_3", line1: "14 Downing Street", city: "London" },
    { id: "addr_4", line1: "1 Whitehall", city: "London" },
    { id: "addr_5", line1: "2 Whitehall", city: "London" },
    { id: "addr_6", line1: "3 Whitehall", city: "London" },
    { id: "addr_7", line1: "4 Whitehall", city: "London" },
    { id: "addr_8", line1: "5 Whitehall", city: "London" },
    { id: "addr_9", line1: "6 Whitehall", city: "London" },
    { id: "addr_10", line1: "7 Whitehall", city: "London" },
    { id: "addr_11", line1: "8 Whitehall", city: "London" },
    { id: "addr_12", line1: "9 Whitehall", city: "London" },
  ],
  EC1A1BB: [],
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const postcode = body.postcode?.replace(/\s+/g, "").toUpperCase();

  if (!postcode) {
    return NextResponse.json(
      { error: "Postcode is required" },
      { status: 400 },
    );
  }

  if (postcode === "M11AE") {
    await new Promise((res) => setTimeout(res, 3000));
    return NextResponse.json({
      postcode: body.postcode,
      addresses: [
        { id: "addr_m1", line1: "1 Piccadilly", city: "Manchester" },
        { id: "addr_m2", line1: "2 Piccadilly", city: "Manchester" },
      ],
    });
  }

  if (postcode === "BS14DJ") {
    bookingStore.bs14djCallCount++;
    if (bookingStore.bs14djCallCount === 1) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      postcode: body.postcode,
      addresses: [
        { id: "addr_bs1", line1: "1 Broad Quay", city: "Bristol" },
        { id: "addr_bs2", line1: "2 Broad Quay", city: "Bristol" },
      ],
    });
  }

  const addresses = POSTCODE_DATA[postcode];

  if (addresses === undefined) {
    return NextResponse.json({ error: "Postcode not found" }, { status: 404 });
  }

  return NextResponse.json({ postcode: body.postcode, addresses });
}
