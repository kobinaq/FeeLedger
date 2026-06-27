"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { canManageBilling, canManagePaymentPlans, canManageSettings, canRecordPayment, canSendReminders } from "@/features/auth/permissions";
import { requireAdminProfile, requirePlatformProfile } from "@/features/auth/server";
import { familySchema, feeItemSchema, feeRuleSchema, paymentPlanSchema, paymentSchema, reminderSchema, schoolSchema, studentSchema } from "@/lib/validators/forms";
import { sendMockNotification } from "@/lib/services/notifications";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

function values(formData: FormData, key: string) {
  return formData.getAll(key).map(String).filter(Boolean);
}

async function audit(action: string, entityType: string, entityId?: string | null, metadata: Record<string, unknown> = {}) {
  const profile = await requireAdminProfile();
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    school_id: profile.school_id,
    actor_id: profile.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata
  });
}

export async function createFamilyAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/families?error=permission");
  const parsed = familySchema.parse({
    guardianName: value(formData, "guardianName"),
    phone: value(formData, "phone"),
    email: value(formData, "email"),
    address: value(formData, "address"),
    notes: value(formData, "notes")
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .insert({
      school_id: profile.school_id,
      guardian_full_name: parsed.guardianName,
      phone: parsed.phone,
      email: parsed.email,
      address: parsed.address,
      notes: parsed.notes
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await audit("created_family", "families", data.id);
  revalidatePath("/admin/families");
  redirect(`/admin/families/${data.id}`);
}

export async function createStudentAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/students?error=permission");
  const parsed = studentSchema.parse({
    firstName: value(formData, "firstName"),
    lastName: value(formData, "lastName"),
    studentCode: value(formData, "studentCode"),
    classId: value(formData, "classId"),
    familyId: value(formData, "familyId")
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert({
      school_id: profile.school_id,
      family_id: parsed.familyId,
      class_id: parsed.classId,
      first_name: parsed.firstName,
      last_name: parsed.lastName,
      student_code: parsed.studentCode,
      optional_services: values(formData, "optionalServices"),
      notes: value(formData, "notes") ?? null
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await audit("created_student", "students", data.id);
  revalidatePath("/admin/students");
  redirect("/admin/students?saved=1");
}

export async function archiveStudentAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role)) redirect("/admin/students?error=permission");
  const studentId = String(formData.get("studentId"));
  const supabase = await createClient();
  const { error } = await supabase.from("students").update({ status: "archived" }).eq("id", studentId).eq("school_id", profile.school_id ?? "");
  if (error) throw new Error(error.message);
  await audit("archived_student", "students", studentId);
  revalidatePath("/admin/students");
}

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
  await audit("created_fee_item", "fee_items", data.id);
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
    .upsert({
      school_id: profile.school_id,
      term_id: parsed.termId,
      class_id: parsed.classId,
      fee_item_id: parsed.feeItemId,
      amount: parsed.amount,
      is_required: parsed.required,
      due_date: parsed.dueDate
    }, { onConflict: "term_id,class_id,fee_item_id" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await audit("upserted_fee_rule", "fee_rules", data.id);
  revalidatePath("/admin/fee-setup");
}

export async function generateBillsAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/bills?error=permission");
  const termId = String(formData.get("termId"));
  const classIds = values(formData, "classIds");
  const publish = formData.get("publish") === "true";
  const supabase = await createClient();
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", profile.school_id)
    .in("class_id", classIds)
    .eq("status", "active");
  if (studentError) throw new Error(studentError.message);

  const { data: rules, error: ruleError } = await supabase
    .from("fee_rules")
    .select("*, fee_items(*)")
    .eq("school_id", profile.school_id)
    .eq("term_id", termId)
    .in("class_id", classIds);
  if (ruleError) throw new Error(ruleError.message);

  let created = 0;
  for (const student of students ?? []) {
    const applicableRules = (rules ?? []).filter((rule) => {
      if (rule.class_id !== student.class_id) return false;
      if (rule.is_required) return true;
      const category = (rule.fee_items as { category?: string } | null)?.category;
      return category ? student.optional_services.includes(category) : false;
    });
    const total = applicableRules.reduce((sum, rule) => sum + Number(rule.amount), 0);
    if (total <= 0) continue;
    const billNumber = `BILL-${new Date().getFullYear()}-${student.student_code}-${Date.now().toString().slice(-5)}`;
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .insert({
        school_id: profile.school_id,
        family_id: student.family_id,
        student_id: student.id,
        term_id: termId,
        bill_number: billNumber,
        status: publish ? "published" : "draft",
        total_amount: total,
        due_date: applicableRules[0]?.due_date ?? new Date().toISOString().slice(0, 10),
        published_at: publish ? new Date().toISOString() : null
      })
      .select("id")
      .single();
    if (billError) throw new Error(billError.message);
    const items = applicableRules.map((rule) => ({
      school_id: profile.school_id!,
      bill_id: bill.id,
      fee_item_id: rule.fee_item_id,
      description: (rule.fee_items as { name?: string } | null)?.name ?? "Fee item",
      amount: Number(rule.amount)
    }));
    const { error: itemError } = await supabase.from("bill_items").insert(items);
    if (itemError) throw new Error(itemError.message);
    created += 1;
  }
  await audit(publish ? "published_bills" : "generated_bill_drafts", "bills", null, { created, termId, classIds });
  revalidatePath("/admin/bills");
  redirect(`/admin/bills?created=${created}`);
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
  await audit("published_bill", "bills", billId);
  revalidatePath("/admin/bills");
}

export async function recordPaymentAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canRecordPayment(profile.role) || !profile.school_id) redirect("/admin/payments/new?error=permission");
  const parsed = paymentSchema.parse({
    familyId: value(formData, "familyId"),
    studentId: value(formData, "studentId"),
    billId: value(formData, "billId"),
    amount: value(formData, "amount"),
    method: value(formData, "method"),
    reference: value(formData, "reference"),
    paymentDate: value(formData, "paymentDate"),
    notes: value(formData, "notes")
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      school_id: profile.school_id,
      family_id: parsed.familyId,
      student_id: parsed.studentId || null,
      bill_id: parsed.billId || null,
      amount: parsed.amount,
      method: parsed.method,
      reference_number: parsed.reference,
      payment_date: parsed.paymentDate ?? new Date().toISOString().slice(0, 10),
      notes: parsed.notes,
      recorded_by: profile.id
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await audit("recorded_payment", "payments", data.id, { amount: parsed.amount, method: parsed.method });
  revalidatePath("/admin/payments");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/families/${parsed.familyId}`);
  redirect(`/admin/payments/new?success=${data.id}`);
}

export async function sendReminderAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canSendReminders(profile.role) || !profile.school_id) redirect("/admin/reminders?error=permission");
  const parsed = reminderSchema.parse({
    familyId: value(formData, "familyId"),
    templateId: value(formData, "templateId"),
    channel: value(formData, "channel"),
    message: value(formData, "message")
  });
  const providerResponse = await sendMockNotification(parsed.channel, parsed.familyId, parsed.message);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reminders")
    .insert({
      school_id: profile.school_id,
      family_id: parsed.familyId,
      reminder_template_id: parsed.templateId || null,
      channel: parsed.channel,
      status: providerResponse.every((result) => result.status === "sent") ? "sent" : "failed",
      message: parsed.message,
      provider_response: providerResponse,
      sent_at: new Date().toISOString(),
      created_by: profile.id
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await audit("sent_reminder", "reminders", data.id);
  revalidatePath("/admin/reminders");
  redirect("/admin/reminders?sent=1");
}

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
  const totalInstallments = parsed.installments.reduce((sum, item) => sum + item.amount, 0);
  if (Math.abs(totalInstallments - parsed.totalBalance) > 0.01) throw new Error("Installments must equal the plan amount.");
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
  await audit("created_payment_plan", "payment_plans", plan.id);
  revalidatePath("/admin/payment-plans");
  revalidatePath(`/admin/families/${parsed.familyId}`);
  redirect("/admin/payment-plans?saved=1");
}

export async function updateSchoolSettingsAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageSettings(profile.role) || !profile.school_id) redirect("/admin/settings?error=permission");
  const parsed = schoolSchema.parse({
    name: value(formData, "name"),
    address: value(formData, "address"),
    phone: value(formData, "phone"),
    email: value(formData, "email"),
    currency: value(formData, "currency") ?? "GHS"
  });
  const supabase = await createClient();
  const { error } = await supabase.from("schools").update(parsed).eq("id", profile.school_id);
  if (error) throw new Error(error.message);
  await audit("updated_school_settings", "schools", profile.school_id);
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function createPlatformSchoolAction(formData: FormData) {
  await requirePlatformProfile();
  const parsed = schoolSchema.parse({
    name: value(formData, "name"),
    address: value(formData, "address"),
    phone: value(formData, "phone"),
    email: value(formData, "email"),
    currency: value(formData, "currency") ?? "GHS"
  });
  const plan = String(formData.get("plan") ?? "starter");
  const supabase = createServiceClient();
  const { data: school, error } = await supabase.from("schools").insert({ ...parsed, status: "active" }).select("id").single();
  if (error) throw new Error(error.message);
  await supabase.from("subscriptions").insert({ school_id: school.id, plan, status: "active" });
  revalidatePath("/platform/schools");
  redirect("/platform/schools?saved=1");
}

export async function toggleSchoolStatusAction(formData: FormData) {
  await requirePlatformProfile();
  const schoolId = String(formData.get("schoolId"));
  const status = String(formData.get("status")) === "active" ? "inactive" : "active";
  const supabase = createServiceClient();
  const { error } = await supabase.from("schools").update({ status }).eq("id", schoolId);
  if (error) throw new Error(error.message);
  revalidatePath("/platform/schools");
}
