import { requireAdminProfile } from "@/features/auth/server";
import { canRecordPayment } from "@/features/auth/permissions";
import { getBills } from "@/features/bills/queries";
import { familyBalance, getFamilies } from "@/features/families/queries";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { PaymentRecorder } from "@/components/payments/payment-recorder";
import { money } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function NewPaymentPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string; familyId?: string }>;
}) {
  const params = await searchParams;
  const profile = await requireAdminProfile();
  if (!canRecordPayment(profile.role)) redirect("/admin/dashboard?error=permission");

  const [families, bills] = await Promise.all([getFamilies(profile.school_id!), getBills(profile.school_id!)]);
  const familyOptions = families.map((family) => ({
    id: family.id,
    guardian_full_name: family.guardian_full_name,
    phone: family.phone,
    balance: familyBalance(family)
  }));
  const billOptions = bills.map((bill) => ({
    id: bill.id,
    family_id: bill.family_id,
    bill_number: bill.bill_number,
    label: `${bill.bill_number} - ${bill.students?.first_name ?? "Student"} - ${money(Number(bill.total_amount) - Number(bill.paid_amount))}`,
    outstanding: Number(bill.total_amount) - Number(bill.paid_amount)
  }));

  return (
    <>
      <PageHeader title="Record Payment" description="Search a family, confirm the balance, then record the payment." />
      {params?.error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">You do not have permission for that action.</p> : null}
      <StepperForm
        current={params?.success ? 4 : familyOptions.length ? 2 : 1}
        steps={["Search family/student", "Confirm balance", "Enter payment", "Generate receipt"]}
      />
      <PaymentRecorder
        families={familyOptions}
        bills={billOptions}
        initialFamilyId={params?.familyId}
        successPaymentId={params?.success}
      />
    </>
  );
}
