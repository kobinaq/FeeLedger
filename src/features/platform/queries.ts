import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PlatformSchoolRow = {
  id: string;
  name: string;
  status: string;
  email: string | null;
  phone: string | null;
  currency: string;
  profiles: { id: string }[] | null;
  students: { id: string }[] | null;
  families: { id: string }[] | null;
  bills: { id: string }[] | null;
  payments: { id: string }[] | null;
  subscriptions: Array<{
    id: string;
    plan: string;
    status: string;
    starts_on: string;
    ends_on: string | null;
  }> | null;
};

export async function getPlatformSchools() {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("id, name, status, email, phone, currency, profiles(id), students(id), families(id), bills(id), payments(id), subscriptions(id, plan, status, starts_on, ends_on)")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as PlatformSchoolRow[];
}

export function schoolUsage(school: PlatformSchoolRow) {
  return {
    users: school.profiles?.length ?? 0,
    students: school.students?.length ?? 0,
    families: school.families?.length ?? 0,
    bills: school.bills?.length ?? 0,
    payments: school.payments?.length ?? 0,
    subscription: school.subscriptions?.[0] ?? null
  };
}

export function platformTotals(schools: PlatformSchoolRow[]) {
  return schools.reduce(
    (acc, school) => {
      const usage = schoolUsage(school);
      acc.schools += 1;
      acc.activeSchools += school.status === "active" ? 1 : 0;
      acc.users += usage.users;
      acc.students += usage.students;
      acc.families += usage.families;
      acc.payments += usage.payments;
      return acc;
    },
    { schools: 0, activeSchools: 0, users: 0, students: 0, families: 0, payments: 0 }
  );
}
