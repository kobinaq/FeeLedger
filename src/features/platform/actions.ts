"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { requirePlatformProfile } from "@/features/auth/server";
import { value } from "@/features/shared/form-data";
import { schoolSchema, subscriptionSchema } from "@/lib/validators/forms";

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
  const startsOn = new Date().toISOString().slice(0, 10);
  await supabase.from("subscriptions").insert({ school_id: school.id, plan, status: "active", starts_on: startsOn });
  revalidatePath("/platform/schools");
  revalidatePath("/platform/subscriptions");
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
  revalidatePath("/platform/subscriptions");
}

export async function updateSubscriptionAction(formData: FormData) {
  await requirePlatformProfile();
  const schoolId = String(formData.get("schoolId"));
  const parsed = subscriptionSchema.parse({
    plan: value(formData, "plan") ?? "starter",
    status: value(formData, "status") ?? "active",
    endsOn: value(formData, "endsOn")
  });
  const supabase = createServiceClient();

  const { data: existing, error: existingError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  if (existing) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        plan: parsed.plan,
        status: parsed.status,
        ends_on: parsed.endsOn || null
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("subscriptions").insert({
      school_id: schoolId,
      plan: parsed.plan,
      status: parsed.status,
      starts_on: new Date().toISOString().slice(0, 10),
      ends_on: parsed.endsOn || null
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/platform/schools");
  revalidatePath("/platform/subscriptions");
  redirect("/platform/subscriptions?saved=1");
}
