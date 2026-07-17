import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStaff } from "@/features/auth/permissions";
import { familyBalance } from "@/features/shared/queries";

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !isStaff(profile.role) || !profile.school_id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type") ?? "arrears";
  const schoolId = profile.school_id;

  if (type === "arrears") {
    const { data: families, error } = await supabase
      .from("families")
      .select("guardian_full_name, phone, email, students(id), bills(total_amount, paid_amount)")
      .eq("school_id", schoolId)
      .order("guardian_full_name");
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

    const rows = [
      ["Guardian", "Phone", "Email", "Children", "Outstanding"].join(","),
      ...(families ?? [])
        .map((family) => {
          const balance = familyBalance(family);
          return {
            family,
            balance
          };
        })
        .filter((row) => row.balance > 0)
        .map(({ family, balance }) =>
          [
            csvEscape(family.guardian_full_name),
            csvEscape(family.phone),
            csvEscape(family.email),
            csvEscape(Array.isArray(family.students) ? family.students.length : 0),
            csvEscape(balance.toFixed(2))
          ].join(",")
        )
    ].join("\n");

    return new NextResponse(rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="feeledger-arrears.csv"'
      }
    });
  }

  if (type === "collections") {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("payment_date, amount, method, reference_number, families(guardian_full_name)")
      .eq("school_id", schoolId)
      .is("reversed_at", null)
      .order("payment_date", { ascending: false });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

    const rows = [
      ["Date", "Family", "Amount", "Method", "Reference"].join(","),
      ...(payments ?? []).map((payment) =>
        [
          csvEscape(payment.payment_date),
          csvEscape((payment.families as { guardian_full_name?: string } | null)?.guardian_full_name),
          csvEscape(Number(payment.amount).toFixed(2)),
          csvEscape(payment.method),
          csvEscape(payment.reference_number)
        ].join(",")
      )
    ].join("\n");

    return new NextResponse(rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="feeledger-collections.csv"'
      }
    });
  }

  return NextResponse.json({ ok: false, error: "Unknown export type." }, { status: 400 });
}
