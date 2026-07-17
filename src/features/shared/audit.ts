import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/features/auth/server";

/** Write an audit log row for the current school staff user. */
export async function writeAuditLog(
  action: string,
  entityType: string,
  entityId?: string | null,
  metadata: Record<string, unknown> = {}
) {
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
