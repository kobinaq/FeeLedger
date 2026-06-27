"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { SuccessState } from "@/components/ui/success-state";
import { families } from "@/lib/demo-data";
import { getFamilyBalance } from "@/lib/data-access";
import { money } from "@/lib/utils";

export default function NewPaymentPage() {
  const [familyId, setFamilyId] = useState(families[0].id);
  const [saved, setSaved] = useState(false);
  const balance = getFamilyBalance(familyId);
  return (
    <>
      <PageHeader title="Record Payment" description="Cashier screen: search, confirm balance, enter payment, and issue receipt." />
      <StepperForm current={saved ? 4 : 2} steps={["Search family/student", "Confirm balance", "Enter payment", "Generate receipt"]} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardTitle>Payment Details</CardTitle>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
            <label className="block text-sm font-semibold">Family account<Select className="mt-1" value={familyId} onChange={(e) => setFamilyId(e.target.value)}>{families.map((family) => <option key={family.id} value={family.id}>{family.guardianName} - {family.phone}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Bill<Select className="mt-1"><option>Allocate to oldest outstanding bill</option></Select></label>
            <label className="block text-sm font-semibold">Amount<Input className="mt-1" type="number" placeholder="500" /></label>
            <label className="block text-sm font-semibold">Payment method<Select className="mt-1"><option>cash</option><option>mobile money</option><option>bank transfer</option><option>cheque</option><option>card/POS</option><option>other</option></Select></label>
            <label className="block text-sm font-semibold">Reference number<Input className="mt-1" placeholder="MOMO-12345" /></label>
            <label className="block text-sm font-semibold">Payment date<Input className="mt-1" type="date" defaultValue="2026-01-27" /></label>
            <label className="md:col-span-2 block text-sm font-semibold">Notes<Textarea className="mt-1" placeholder="Optional note for the receipt" /></label>
            <Button className="md:col-span-2" type="submit">Record Payment and Generate Receipt</Button>
          </form>
        </Card>
        <div className="space-y-4">
          <Card><p className="text-sm text-slate-500">Outstanding balance before payment</p><p className="mt-2 text-3xl font-bold">{money(balance)}</p></Card>
          {saved ? <SuccessState title="Payment recorded" message={`Receipt RCPT-2026-1042 has been generated. Remaining balance will show as ${money(Math.max(0, balance - 500))}.`}><div className="flex flex-wrap gap-2"><Button>Print Receipt</Button><Button variant="secondary">Send Receipt</Button><Link href="/admin/payments/new"><Button variant="secondary">Record Another Payment</Button></Link><Link href={`/admin/families/${familyId}`}><Button variant="secondary">View Family Account</Button></Link></div></SuccessState> : null}
        </div>
      </div>
    </>
  );
}
