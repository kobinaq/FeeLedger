import { Suspense } from "react";
import { Field } from "@/components/forms/field";
import { archiveStudentAction, createStudentAction } from "@/features/students/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { canManageBilling } from "@/features/auth/permissions";
import { getFamilies } from "@/features/families/queries";
import { getClasses } from "@/features/schools/queries";
import { getStudents } from "@/features/students/queries";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { StudentFilters } from "@/components/students/student-filters";
import { Td, Th, Table } from "@/components/ui/table";

export default async function StudentsPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; classId?: string; status?: string; error?: string }>;
}) {
  const params = await searchParams;
  const profile = await requireAdminProfile();
  const [students, classes, families] = await Promise.all([
    getStudents(profile.school_id!),
    getClasses(profile.school_id!),
    getFamilies(profile.school_id!)
  ]);
  const q = (params?.q ?? "").trim().toLowerCase();
  const classId = params?.classId ?? "";
  const status = params?.status ?? "active";
  const filtered = students.filter((student) => {
    if (status === "active" && student.status === "archived") return false;
    if (status === "archived" && student.status !== "archived") return false;
    if (classId && student.class_id !== classId) return false;
    if (!q) return true;
    const haystack = `${student.first_name} ${student.last_name} ${student.student_code} ${student.families?.guardian_full_name ?? ""}`.toLowerCase();
    return haystack.includes(q);
  });

  return (
    <>
      <PageHeader title="Students" description="Maintain student records, family links, classes, and optional services." />
      {params?.error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">You do not have permission for that action.</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <Suspense fallback={<Input placeholder="Search..." disabled />}>
              <SearchBox placeholder="Search by student, parent, or code" />
            </Suspense>
            <Suspense fallback={null}>
              <StudentFilters classes={classes} />
            </Suspense>
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No students found" message="Adjust filters or add a student." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Student</Th>
                  <Th>Code</Th>
                  <Th>Class</Th>
                  <Th>Family</Th>
                  <Th>Optional Services</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id}>
                    <Td>
                      {student.first_name} {student.last_name}
                    </Td>
                    <Td>{student.student_code}</Td>
                    <Td>{student.classes?.name}</Td>
                    <Td>{student.families?.guardian_full_name}</Td>
                    <Td>{student.optional_services.join(", ") || "None"}</Td>
                    <Td>
                      {canManageBilling(profile.role) && student.status !== "archived" ? (
                        <form action={archiveStudentAction}>
                          <input type="hidden" name="studentId" value={student.id} />
                          <Button variant="secondary">Archive</Button>
                        </form>
                      ) : null}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
        {canManageBilling(profile.role) ? (
          <Card>
            <CardTitle>Student Form</CardTitle>
            <form action={createStudentAction} className="mt-4 space-y-5">
              <section className="space-y-3">
                <h3 className="font-semibold">1. Student Details</h3>
                <Field label="First name">
                  <Input name="firstName" placeholder="Ama" required />
                </Field>
                <Field label="Last name">
                  <Input name="lastName" placeholder="Boateng" required />
                </Field>
                <Field label="Student code">
                  <Input name="studentCode" placeholder="GPS-B1-001" required />
                </Field>
              </section>
              <section className="space-y-3">
                <h3 className="font-semibold">2. Class</h3>
                <Field label="Class">
                  <Select name="classId">
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </section>
              <section className="space-y-3">
                <h3 className="font-semibold">3. Family Account</h3>
                <Field label="Family">
                  <Select name="familyId">
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.guardian_full_name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </section>
              <section className="space-y-3">
                <h3 className="font-semibold">4. Optional Services</h3>
                <div className="grid gap-2 text-sm">
                  <label>
                    <input name="optionalServices" value="feeding" type="checkbox" /> Feeding
                  </label>
                  <label>
                    <input name="optionalServices" value="transport" type="checkbox" /> Transport
                  </label>
                  <label>
                    <input name="optionalServices" value="boarding" type="checkbox" /> Boarding
                  </label>
                  <label>
                    <input name="optionalServices" value="extra classes" type="checkbox" /> Extra classes
                  </label>
                </div>
                <Field label="Notes">
                  <Textarea name="notes" placeholder="Anything the accounts office should know" />
                </Field>
              </section>
              <Button className="w-full">Save Student</Button>
            </form>
          </Card>
        ) : null}
      </div>
    </>
  );
}
