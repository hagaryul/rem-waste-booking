import { NextResponse } from "next/server";
import { bookingStore } from "@/lib/store";

export async function POST() {
  bookingStore.reset();
  return NextResponse.json({ ok: true });
}
