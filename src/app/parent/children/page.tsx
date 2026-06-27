import { Card } from "@/components/ui/card";
import { getClassName, getFamilyStudents, getParentFamily } from "@/lib/data-access";

export default function ParentChildrenPage() {
  const family = getParentFamily();
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Children</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{getFamilyStudents(family.id).map((student) => <Card key={student.id}><p className="text-xl font-bold">{student.firstName} {student.lastName}</p><p className="mt-2 text-sm text-slate-500">{student.studentCode}</p><p className="mt-1 text-sm text-slate-500">{getClassName(student.classId)}</p><p className="mt-3 text-sm">Services: {student.optionalServices.join(", ") || "None"}</p></Card>)}</div>
    </>
  );
}
