import { NextResponse } from "next/server";
import { publishBills } from "@/lib/services/billing";

export async function POST() {
  return NextResponse.json(await publishBills());
}
