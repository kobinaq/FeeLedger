"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { recordPaymentAction } from "@/features/payments/actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { money } from "@/lib/utils";

type FamilyOption = {
  id: string;
  guardian_full_name: string;
  phone: string;
  balance: number;
};

type BillOption = {
  id: string;
  family_id: string;
  bill_number: string;
  label: string;
  outstanding: number;
};

export function PaymentRecorder({
  families,
  bills,
  initialFamilyId,
  successPaymentId
}: {
  families: FamilyOption[];
  bills: BillOption[];
  initialFamilyId?: string;
  successPaymentId?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [familyId, setFamilyId] = useState(initialFamilyId ?? families[0]?.id ?? "");
  const selected = families.find((family) => family.id === familyId);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return families;
    return families.filter(
      (family) =>
        family.guardian_full_name.toLowerCase().includes(q) ||
        family.phone.toLowerCase().includes(q)
    );
  }, [families, query]);
  const familyBills = bills.filter((bill) => bill.family_id === familyId && bill.outstanding > 0);

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardTitle>Payment Details</CardTitle>
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-semibold">
            Search family
            <Input
              className="mt-1"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Guardian name or phone"
            />
          </label>
          <form action={recordPaymentAction} className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold md:col-span-2">
              Family account
              <Select className="mt-1" name="familyId" required value={familyId} onChange={(e) => setFamilyId(e.target.value)}>
                {filtered.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.guardian_full_name} - {family.phone} - {money(family.balance)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block text-sm font-semibold">
              Bill
              <Select className="mt-1" name="billId">
                <option value="">Allocate to family balance</option>
                {familyBills.map((bill) => (
                  <option key={bill.id} value={bill.id}>
                    {bill.label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block text-sm font-semibold">
              Amount
              <Input className="mt-1" name="amount" type="number" min="1" step="0.01" placeholder="500" required />
            </label>
            <label className="block text-sm font-semibold">
              Payment method
              <Select className="mt-1" name="method">
                <option>cash</option>
                <option>mobile money</option>
                <option>bank transfer</option>
                <option>cheque</option>
                <option>card/POS</option>
                <option>other</option>
              </Select>
            </label>
            <label className="block text-sm font-semibold">
              Reference number
              <Input className="mt-1" name="reference" placeholder="MOMO-12345" required />
            </label>
            <label className="block text-sm font-semibold">
              Payment date
              <Input className="mt-1" name="paymentDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </label>
            <label className="md:col-span-2 block text-sm font-semibold">
              Notes
              <Textarea className="mt-1" name="notes" placeholder="Optional note for the receipt" />
            </label>
            <Button className="md:col-span-2" type="submit">
              Record Payment and Generate Receipt
            </Button>
          </form>
        </div>
      </Card>
      <div className="space-y-4">
        <Card>
          <p className="text-sm text-slate-500">Outstanding balance before payment</p>
          <p className="mt-2 text-3xl font-bold">{money(selected?.balance ?? 0)}</p>
          <p className="mt-2 text-sm text-slate-500">{selected?.guardian_full_name ?? "Select a family"}</p>
        </Card>
        {successPaymentId ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <p className="font-semibold text-emerald-900">Payment recorded</p>
            <p className="mt-1 text-sm text-emerald-800">A receipt has been generated and balances were updated.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`/admin/receipts/${successPaymentId}`}>
                <Button type="button">Open Receipt</Button>
              </a>
              <Button type="button" variant="secondary" onClick={() => router.push("/admin/payments/new")}>
                Record Another
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
