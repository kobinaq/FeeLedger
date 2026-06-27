import { ReceiptCard } from "@/components/parent/receipt-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { receipts } from "@/lib/demo-data";
import { getFamily, getStudent } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default function ReceiptsPage() {
  return (
    <>
      <PageHeader title="Receipts" description="View, print, search, and resend receipts issued after payment." action="Print Selected" />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-4"><SearchBox placeholder="Search by receipt, family, reference, or date" /></div>
          <Table><thead><tr><Th>Receipt</Th><Th>Date</Th><Th>Family</Th><Th>Student</Th><Th>Method</Th><Th>Amount</Th><Th></Th></tr></thead><tbody>{receipts.map((receipt) => <tr key={receipt.id}><Td>{receipt.receiptNumber}</Td><Td>{shortDate(receipt.date)}</Td><Td>{getFamily(receipt.familyId)?.guardianName}</Td><Td>{getStudent(receipt.studentId)?.firstName}</Td><Td>{receipt.method}</Td><Td>{money(receipt.amount)}</Td><Td><Button variant="secondary">Resend</Button></Td></tr>)}</tbody></Table>
        </Card>
        <div className="space-y-3">{receipts.slice(0, 3).map((receipt) => <ReceiptCard key={receipt.id} receipt={receipt} />)}</div>
      </div>
    </>
  );
}
