import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const SCHOOL_ID = "00000000-0000-0000-0000-000000000001";
const PARENT_FAMILY_ID = "40000000-0000-0000-0000-000000000001";
const PASSWORD = process.env.DEMO_USER_PASSWORD ?? "demo12345";

const demoUsers = [
  {
    email: "platform@feeledger.test",
    fullName: "Platform Owner",
    role: "platform_admin",
    schoolId: null,
    familyId: null,
  },
  {
    email: "proprietor@gracefield.test",
    fullName: "Mrs. Evelyn Mensah",
    role: "school_admin",
    schoolId: SCHOOL_ID,
    familyId: null,
  },
  {
    email: "headteacher@gracefield.test",
    fullName: "Mr. Daniel Armah",
    role: "headteacher",
    schoolId: SCHOOL_ID,
    familyId: null,
  },
  {
    email: "accountant@gracefield.test",
    fullName: "Abena Osei",
    role: "accountant",
    schoolId: SCHOOL_ID,
    familyId: null,
  },
  {
    email: "cashier@gracefield.test",
    fullName: "Kojo Appiah",
    role: "cashier",
    schoolId: SCHOOL_ID,
    familyId: null,
  },
  {
    email: "parent@gracefield.test",
    fullName: "Ama Boateng",
    role: "parent",
    schoolId: SCHOOL_ID,
    familyId: null,
  },
];

const createdProfiles = new Map();

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function upsertDemoUser(user) {
  const existing = await findUserByEmail(user.email);
  const userMetadata = { full_name: user.fullName, role: user.role };
  const familyId = user.email === "parent@gracefield.test" ? await getParentFamilyId() : user.familyId;
  // JWT app_metadata lets middleware route without a profiles query on every request.
  const appMetadata = {
    feeledger_role: user.role,
    feeledger_school_id: user.schoolId,
    feeledger_family_id: familyId,
  };

  const result = existing
    ? await supabase.auth.admin.updateUserById(existing.id, {
        email: user.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: userMetadata,
        app_metadata: appMetadata,
      })
    : await supabase.auth.admin.createUser({
        email: user.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: userMetadata,
        app_metadata: appMetadata,
      });

  if (result.error) throw result.error;
  const authUser = result.data.user;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authUser.id,
    school_id: user.schoolId,
    family_id: familyId,
    full_name: user.fullName,
    email: user.email,
    role: user.role,
  });
  if (profileError) throw profileError;

  // Parent family id may only resolve after seed; re-sync claims after profile upsert.
  if (familyId !== user.familyId || !existing) {
    await supabase.auth.admin.updateUserById(authUser.id, {
      app_metadata: {
        feeledger_role: user.role,
        feeledger_school_id: user.schoolId,
        feeledger_family_id: familyId,
      },
    });
  }

  createdProfiles.set(user.email, authUser.id);
  console.log(`Ready: ${user.email} (${user.role})`);
}

async function getParentFamilyId() {
  const { data, error } = await supabase
    .from("families")
    .select("id")
    .eq("id", PARENT_FAMILY_ID)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

async function backfillDemoReferences() {
  const cashierId = createdProfiles.get("cashier@gracefield.test");
  const accountantId = createdProfiles.get("accountant@gracefield.test");
  const parentId = createdProfiles.get("parent@gracefield.test");
  const parentFamilyId = await getParentFamilyId();

  if (cashierId) {
    const { error: paymentsError } = await supabase
      .from("payments")
      .update({ recorded_by: cashierId })
      .eq("school_id", SCHOOL_ID)
      .like("reference_number", "SEED-%")
      .is("recorded_by", null);
    if (paymentsError) throw paymentsError;

    const { error: receiptsError } = await supabase
      .from("receipts")
      .update({ recorded_by: cashierId })
      .eq("school_id", SCHOOL_ID)
      .like("reference_number", "SEED-%")
      .is("recorded_by", null);
    if (receiptsError) throw receiptsError;
  }

  if (accountantId) {
    const { error: planError } = await supabase
      .from("payment_plans")
      .update({ approved_by: accountantId })
      .eq("id", "90000000-0000-0000-0000-000000000001")
      .is("approved_by", null);
    if (planError) throw planError;
  }

  if (parentId && parentFamilyId) {
    const { error: parentError } = await supabase
      .from("profiles")
      .update({ family_id: parentFamilyId })
      .eq("id", parentId);
    if (parentError) throw parentError;

    await supabase.auth.admin.updateUserById(parentId, {
      app_metadata: {
        feeledger_role: "parent",
        feeledger_school_id: SCHOOL_ID,
        feeledger_family_id: parentFamilyId,
      },
    });
  }
}

for (const user of demoUsers) {
  await upsertDemoUser(user);
}

await backfillDemoReferences();

console.log(`Demo users are ready. Password: ${PASSWORD}`);
