import Link from "next/link";
import { requireAdminProfile } from "@/features/auth/server";
import { getPayments } from "@/features/payments/queries";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { money, shortDate } from "@/lib/utils";

export default async function PaymentsPage() {
  const profile = await requireAdminProfile();
  const payments = await getPayments(profile.school_id!);
  return (
    <>
      <PageHeader title="Payments" description="Search, review, and record school fee payments." action="Record Payment" />
      <Card>
        <div className="mb-4"><SearchBox placeholder="Search by parent, student, phone, or reference" /></div>
        <Table><thead><tr><Th>Date</Th><Th>Family</Th><Th>Student</Th><Th>Method</Th><Th>Reference</Th><Th>Amount</Th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><Td>{shortDate(payment.payment_date)}</Td><Td>{payment.families?.guardian_full_name}</Td><Td>{payment.students?.first_name}</Td><Td>{payment.method}</Td><Td>{payment.reference_number}</Td><Td>{money(payment.amount)}</Td></tr>)}</tbody></Table>
        <Link href="/admin/payments/new" className="mt-4 inline-block font-semibold text-brand-green">Open cashier screen</Link>
      </Card>
    </>
  );
}
