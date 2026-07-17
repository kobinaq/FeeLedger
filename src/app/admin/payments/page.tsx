import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireAdminNav } from "@/features/auth/server";
import { getPayments } from "@/features/payments/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { money, shortDate } from "@/lib/utils";

export default async function PaymentsPage() {
  const profile = await requireAdminNav("payments");
  const payments = await getPayments(profile.school_id!);
  return (
    <>
      <PageHeader
        title="Payments"
        description="Review manual and online payments with their receipt references."
        action={<Link href="/admin/payments/new"><Button>Record Payment</Button></Link>}
      />
      <Card>
        <div className="mb-4"><SearchBox placeholder="Search by parent, student, phone, or reference" /></div>
        <Table><thead><tr><Th>Date</Th><Th>Family</Th><Th>Student</Th><Th>Source</Th><Th>Method</Th><Th>Reference</Th><Th>Amount</Th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><Td>{shortDate(payment.payment_date)}</Td><Td>{payment.families?.guardian_full_name}</Td><Td>{payment.students?.first_name}</Td><Td><Badge value={payment.source ?? "manual"} /></Td><Td>{payment.method}</Td><Td>{payment.provider_reference ?? payment.reference_number}</Td><Td>{money(payment.amount)}</Td></tr>)}</tbody></Table>
      </Card>
    </>
  );
}
