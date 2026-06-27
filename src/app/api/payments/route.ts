import { NextResponse } from "next/server";
import { recordPayment } from "@/lib/services/payments";
import { paymentSchema } from "@/lib/validators/forms";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const result = await recordPayment({ ...parsed.data, method: parsed.data.method as never, reference: parsed.data.reference });
  return NextResponse.json(result);
}
