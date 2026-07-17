"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageBilling } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { values } from "@/features/shared/form-data";

export async function generateBillsAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/bills?error=permission");
  const termId = String(formData.get("termId"));
  const classIds = values(formData, "classIds");
  const publish = formData.get("publish") === "true";
  if (!termId || classIds.length === 0) redirect("/admin/bills?error=missing");

  const supabase = await createClient();
  // Single transactional RPC — audit is written inside the function.
  const { data: created, error } = await supabase.rpc("generate_bills_for_classes", {
    p_school_id: profile.school_id,
    p_term_id: termId,
    p_class_ids: classIds,
    p_publish: publish
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/bills");
  redirect(`/admin/bills?created=${created ?? 0}`);
}

export async function publishBillAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role)) redirect("/admin/bills?error=permission");
  const billId = String(formData.get("billId"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("bills")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", billId)
    .eq("school_id", profile.school_id ?? "");
  if (error) throw new Error(error.message);
  await writeAuditLog("published_bill", "bills", billId);
  revalidatePath("/admin/bills");
}
