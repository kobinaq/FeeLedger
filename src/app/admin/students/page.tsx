import { Field } from "@/components/forms/field";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { classes, families, students } from "@/lib/demo-data";
import { getClassName, getFamily } from "@/lib/data-access";

export default function StudentsPage() {
  return (
    <>
      <PageHeader title="Students" description="Create, edit, archive, search, and link children to family accounts." action="Add Student" />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <SearchBox placeholder="Search by student, parent, or code" />
            <Select><option>All classes</option>{classes.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
            <Select><option>Active students</option><option>Archived students</option></Select>
          </div>
          <Table>
            <thead><tr><Th>Student</Th><Th>Code</Th><Th>Class</Th><Th>Family</Th><Th>Optional Services</Th></tr></thead>
            <tbody>{students.map((student) => <tr key={student.id}><Td>{student.firstName} {student.lastName}</Td><Td>{student.studentCode}</Td><Td>{getClassName(student.classId)}</Td><Td>{getFamily(student.familyId)?.guardianName}</Td><Td>{student.optionalServices.join(", ") || "None"}</Td></tr>)}</tbody>
          </Table>
        </Card>
        <Card>
          <CardTitle>Student Form</CardTitle>
          <form className="mt-4 space-y-5">
            <section className="space-y-3"><h3 className="font-semibold">1. Student Details</h3><Field label="First name"><Input placeholder="Ama" /></Field><Field label="Last name"><Input placeholder="Boateng" /></Field><Field label="Student code"><Input placeholder="GPS-B1-001" /></Field></section>
            <section className="space-y-3"><h3 className="font-semibold">2. Class</h3><Field label="Class"><Select>{classes.map((c) => <option key={c.id}>{c.name}</option>)}</Select></Field></section>
            <section className="space-y-3"><h3 className="font-semibold">3. Family Account</h3><Field label="Family"><Select>{families.map((f) => <option key={f.id}>{f.guardianName}</option>)}</Select></Field></section>
            <section className="space-y-3"><h3 className="font-semibold">4. Optional Services</h3><div className="grid gap-2 text-sm"><label><input type="checkbox" /> Feeding</label><label><input type="checkbox" /> Transport</label><label><input type="checkbox" /> Boarding</label><label><input type="checkbox" /> Extra classes</label></div><Field label="Notes"><Textarea placeholder="Anything the accounts office should know" /></Field></section>
          </form>
        </Card>
      </div>
    </>
  );
}
