"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageBilling } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { value } from "@/features/shared/form-data";
import { feeItemSchema, feeRuleSchema } from "@/lib/validators/forms";

export async function createFeeItemAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/fee-setup?error=permission");
  const parsed = feeItemSchema.parse({
    name: value(formData, "name"),
    category: value(formData, "category"),
    required: formData.get("required") === "on",
    defaultDueDate: value(formData, "defaultDueDate"),
    description: value(formData, "description")
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fee_items")
    .insert({
      school_id: profile.school_id,
      name: parsed.name,
      category: parsed.category,
      is_required: parsed.required,
      default_due_date: parsed.defaultDueDate,
      description: parsed.description
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await writeAuditLog("created_fee_item", "fee_items", data.id);
  revalidatePath("/admin/fee-setup");
}

export async function createFeeRuleAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/fee-setup?error=permission");
  const parsed = feeRuleSchema.parse({
    termId: value(formData, "termId"),
    classId: value(formData, "classId"),
    feeItemId: value(formData, "feeItemId"),
    amount: value(formData, "amount"),
    required: formData.get("required") === "on",
    dueDate: value(formData, "dueDate")
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fee_rules")
    .upsert(
      {
        school_id: profile.school_id,
        term_id: parsed.termId,
        class_id: parsed.classId,
        fee_item_id: parsed.feeItemId,
        amount: parsed.amount,
        is_required: parsed.required,
        due_date: parsed.dueDate
      },
      { onConflict: "term_id,class_id,fee_item_id" }
    )
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await writeAuditLog("upserted_fee_rule", "fee_rules", data.id);
  revalidatePath("/admin/fee-setup");
}
