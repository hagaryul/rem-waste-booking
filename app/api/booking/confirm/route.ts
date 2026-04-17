import { NextRequest, NextResponse } from "next/server";
import { bookingStore } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postcode, addressId, heavyWaste, plasterboard, skipSize, price } =
    body;

  if (!postcode || !addressId || !skipSize || price === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const bookingKey = `${postcode}-${addressId}-${skipSize}`;

  if (bookingStore.usedBookings.has(bookingKey)) {
    return NextResponse.json({ error: "Duplicate booking" }, { status: 409 });
  }

  bookingStore.usedBookings.add(bookingKey);

  const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

  return NextResponse.json({ status: "success", bookingId });
}
