import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireParentProfile } from "@/features/auth/server";
import { getCurrentSchool } from "@/features/schools/queries";

export default async function ParentContactPage() {
  const profile = await requireParentProfile();
  const school = await getCurrentSchool(profile.school_id!);
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Contact Accounts Office</h1>
      <Card className="mt-5">
        <CardTitle>Need help?</CardTitle>
        <p className="mt-2 text-sm text-slate-500">
          Contact the school accounts office if you have a question about your balance, receipt, or payment plan.
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>Phone:</strong>{" "}
            {school.phone ? (
              <a className="text-brand-green" href={`tel:${school.phone}`}>
                {school.phone}
              </a>
            ) : (
              "Not listed"
            )}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {school.email ? (
              <a className="text-brand-green" href={`mailto:${school.email}`}>
                {school.email}
              </a>
            ) : (
              "Not listed"
            )}
          </p>
          <p>
            <strong>Address:</strong> {school.address}
          </p>
        </div>
        <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm">
          <strong>Payment instructions</strong>
          <p className="mt-1">
            Pay by cash at the accounts office, mobile money, bank transfer, cheque, or card/POS. Please include your family name as the
            reference.
          </p>
        </div>
        {school.phone ? (
          <a href={`tel:${school.phone}`}>
            <Button className="mt-5">Call Accounts Office</Button>
          </a>
        ) : null}
      </Card>
    </>
  );
}
