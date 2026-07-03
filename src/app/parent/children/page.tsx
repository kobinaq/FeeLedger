import { Card } from "@/components/ui/card";
import { requireParentProfile } from "@/features/auth/server";
import { getParentFamily } from "@/features/families/queries";

export default async function ParentChildrenPage() {
  const profile = await requireParentProfile();
  const family = await getParentFamily(profile.family_id!);
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Children</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{family.students?.map((student) => <Card key={student.id}><p className="text-xl font-bold">{student.first_name} {student.last_name}</p><p className="mt-2 text-sm text-slate-500">{student.student_code}</p><p className="mt-1 text-sm text-slate-500">Linked class</p><p className="mt-3 text-sm">Services: {student.optional_services.join(", ") || "None"}</p></Card>)}</div>
    </>
  );
}
