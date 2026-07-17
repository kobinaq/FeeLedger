import { Suspense } from "react";
import Link from "next/link";
import { ReceiptCard } from "@/components/parent/receipt-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { requireAdminProfile } from "@/features/auth/server";
import { getReceipts } from "@/features/receipts/queries";
import { money, shortDate } from "@/lib/utils";

export default async function ReceiptsPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const profile = await requireAdminProfile();
  const receipts = await getReceipts(profile.school_id!);
  const q = (params?.q ?? "").trim().toLowerCase();
  const filtered = q
    ? receipts.filter((receipt) => {
        const haystack = `${receipt.receipt_number} ${receipt.families?.guardian_full_name ?? ""} ${receipt.reference_number ?? ""} ${receipt.receipt_date}`.toLowerCase();
        return haystack.includes(q);
      })
    : receipts;

  return (
    <>
      <PageHeader title="Receipts" description="Search issued receipts and open the printable receipt view for proof of payment." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-4">
            <Suspense fallback={<Input placeholder="Search..." disabled />}>
              <SearchBox placeholder="Search by receipt, family, reference, or date" />
            </Suspense>
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No receipts found" message="Try another search." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Receipt</Th>
                  <Th>Date</Th>
                  <Th>Family</Th>
                  <Th>Student</Th>
                  <Th>Method</Th>
                  <Th>Amount</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((receipt) => (
                  <tr key={receipt.id}>
                    <Td>
                      <Link className="font-semibold text-brand-green" href={`/admin/receipts/${receipt.id}`}>
                        {receipt.receipt_number}
                      </Link>
                    </Td>
                    <Td>{shortDate(receipt.receipt_date)}</Td>
                    <Td>{receipt.families?.guardian_full_name}</Td>
                    <Td>{receipt.students?.first_name}</Td>
                    <Td>{receipt.method}</Td>
                    <Td>{money(receipt.amount)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
        <div className="space-y-3">
          {receipts.slice(0, 3).map((receipt) => (
            <Link key={receipt.id} href={`/admin/receipts/${receipt.id}`}>
              <ReceiptCard receipt={receipt} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
