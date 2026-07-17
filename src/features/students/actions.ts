"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageBilling } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { value, values } from "@/features/shared/form-data";
import { studentSchema } from "@/lib/validators/forms";

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
  await writeAuditLog("created_student", "students", data.id);
  revalidatePath("/admin/students");
  redirect("/admin/students?saved=1");
}

export async function archiveStudentAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role)) redirect("/admin/students?error=permission");
  const studentId = String(formData.get("studentId"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ status: "archived" })
    .eq("id", studentId)
    .eq("school_id", profile.school_id ?? "");
  if (error) throw new Error(error.message);
  await writeAuditLog("archived_student", "students", studentId);
  revalidatePath("/admin/students");
}
