import Link from "next/link";
import { ReceiptCard } from "@/components/parent/receipt-card";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { requireAdminProfile } from "@/features/auth/server";
import { getReceipts } from "@/features/receipts/queries";
import { money, shortDate } from "@/lib/utils";

export default async function ReceiptsPage() {
  const profile = await requireAdminProfile();
  const receipts = await getReceipts(profile.school_id!);
  return (
    <>
      <PageHeader title="Receipts" description="Search issued receipts and open the printable receipt view for proof of payment." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-4"><SearchBox placeholder="Search by receipt, family, reference, or date" /></div>
          <Table><thead><tr><Th>Receipt</Th><Th>Date</Th><Th>Family</Th><Th>Student</Th><Th>Method</Th><Th>Amount</Th></tr></thead><tbody>{receipts.map((receipt) => <tr key={receipt.id}><Td><Link className="font-semibold text-brand-green" href={`/admin/receipts/${receipt.id}`}>{receipt.receipt_number}</Link></Td><Td>{shortDate(receipt.receipt_date)}</Td><Td>{receipt.families?.guardian_full_name}</Td><Td>{receipt.students?.first_name}</Td><Td>{receipt.method}</Td><Td>{money(receipt.amount)}</Td></tr>)}</tbody></Table>
        </Card>
        <div className="space-y-3">{receipts.slice(0, 3).map((receipt) => <ReceiptCard key={receipt.id} receipt={receipt} />)}</div>
      </div>
    </>
  );
}
