import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireAdminProfile } from "@/features/auth/server";
import { canRecordPayment } from "@/features/auth/permissions";
import { getPayments } from "@/features/payments/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { money, shortDate } from "@/lib/utils";

export default async function PaymentsPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const profile = await requireAdminProfile();
  const payments = await getPayments(profile.school_id!);
  const q = (params?.q ?? "").trim().toLowerCase();
  const filtered = q
    ? payments.filter((payment) => {
        const haystack = `${payment.families?.guardian_full_name ?? ""} ${payment.students?.first_name ?? ""} ${payment.reference_number ?? ""} ${payment.provider_reference ?? ""} ${payment.families?.phone ?? ""}`.toLowerCase();
        return haystack.includes(q);
      })
    : payments;

  return (
    <>
      <PageHeader
        title="Payments"
        description="Review manual and online payments with their receipt references."
        action={
          canRecordPayment(profile.role) ? (
            <Link href="/admin/payments/new">
              <Button>Record Payment</Button>
            </Link>
          ) : undefined
        }
      />
      <Card>
        <div className="mb-4">
          <Suspense fallback={<Input placeholder="Search..." disabled />}>
            <SearchBox placeholder="Search by parent, student, phone, or reference" />
          </Suspense>
        </div>
        {filtered.length === 0 ? (
          <EmptyState title="No payments found" message="Record a payment or clear the search." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Family</Th>
                <Th>Student</Th>
                <Th>Source</Th>
                <Th>Method</Th>
                <Th>Reference</Th>
                <Th>Amount</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id}>
                  <Td>{shortDate(payment.payment_date)}</Td>
                  <Td>{payment.families?.guardian_full_name}</Td>
                  <Td>{payment.students?.first_name}</Td>
                  <Td>
                    <Badge value={payment.source ?? "manual"} />
                  </Td>
                  <Td>{payment.method}</Td>
                  <Td>{payment.provider_reference ?? payment.reference_number}</Td>
                  <Td>{money(payment.amount)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
