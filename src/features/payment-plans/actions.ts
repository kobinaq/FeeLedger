"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManagePaymentPlans } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { value, values } from "@/features/shared/form-data";
import { validateInstallmentTotal } from "@/lib/services/domain";
import { paymentPlanSchema } from "@/lib/validators/forms";

export async function createPaymentPlanAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManagePaymentPlans(profile.role) || !profile.school_id) redirect("/admin/payment-plans?error=permission");
  const dueDates = values(formData, "dueDate");
  const amounts = values(formData, "installmentAmount").map(Number);
  const parsed = paymentPlanSchema.parse({
    familyId: value(formData, "familyId"),
    totalBalance: value(formData, "totalBalance"),
    installments: dueDates.map((dueDate, index) => ({ dueDate, amount: amounts[index] }))
  });
  if (!validateInstallmentTotal(parsed.totalBalance, parsed.installments)) {
    throw new Error("Installments must equal the plan amount.");
  }
  const supabase = await createClient();
  const { data: plan, error: planError } = await supabase
    .from("payment_plans")
    .insert({
      school_id: profile.school_id,
      family_id: parsed.familyId,
      total_balance: parsed.totalBalance,
      status: "active",
      approved_by: profile.id,
      notes: value(formData, "notes") ?? null
    })
    .select("id")
    .single();
  if (planError) throw new Error(planError.message);
  const { error: installmentError } = await supabase.from("payment_plan_installments").insert(
    parsed.installments.map((item) => ({
      school_id: profile.school_id!,
      payment_plan_id: plan.id,
      due_date: item.dueDate,
      amount: item.amount
    }))
  );
  if (installmentError) throw new Error(installmentError.message);
  await writeAuditLog("created_payment_plan", "payment_plans", plan.id);
  revalidatePath("/admin/payment-plans");
  revalidatePath(`/admin/families/${parsed.familyId}`);
  redirect("/admin/payment-plans?saved=1");
}
