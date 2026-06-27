import type {
  Bill,
  BillItem,
  ClassRoom,
  Family,
  FeeItem,
  FeeRule,
  Payment,
  PaymentPlan,
  PaymentPlanInstallment,
  Profile,
  Receipt,
  Reminder,
  ReminderTemplate,
  School,
  Student
} from "@/types";

export const school: School = {
  id: "school-gracefield",
  name: "Gracefield Preparatory School",
  address: "12 Independence Avenue, Accra",
  phone: "+233 30 245 7788",
  email: "accounts@gracefield.test",
  currency: "GHS",
  status: "active",
  plan: "growth"
};

export const profiles: Profile[] = [
  { id: "platform", fullName: "Platform Owner", email: "platform@feeledger.test", role: "platform_admin" },
  { id: "prop", schoolId: school.id, fullName: "Mrs. Evelyn Mensah", email: "proprietor@gracefield.test", role: "school_admin" },
  { id: "head", schoolId: school.id, fullName: "Mr. Daniel Armah", email: "headteacher@gracefield.test", role: "headteacher" },
  { id: "acct", schoolId: school.id, fullName: "Abena Osei", email: "accountant@gracefield.test", role: "accountant" },
  { id: "cash", schoolId: school.id, fullName: "Kojo Appiah", email: "cashier@gracefield.test", role: "cashier" },
  { id: "parent-user", schoolId: school.id, familyId: "fam-1", fullName: "Ama Boateng", email: "parent@gracefield.test", role: "parent" }
];

export const classes: ClassRoom[] = [
  "Nursery 1",
  "Nursery 2",
  "KG 1",
  "KG 2",
  "Basic 1",
  "Basic 2",
  "Basic 3",
  "Basic 4",
  "Basic 5",
  "Basic 6",
  "JHS 1",
  "JHS 2",
  "JHS 3"
].map((name, index) => ({ id: `class-${index + 1}`, schoolId: school.id, name }));

export const academicYears = [{ id: "ay-2026", schoolId: school.id, name: "2026 Academic Year", startsOn: "2026-01-06", endsOn: "2026-12-18" }];
export const terms = [{ id: "term-2026-1", schoolId: school.id, academicYearId: "ay-2026", name: "2026 Term 1", startsOn: "2026-01-06", endsOn: "2026-04-10", isCurrent: true }];

export const families: Family[] = [
  { id: "fam-1", schoolId: school.id, guardianName: "Ama Boateng", phone: "+233 24 111 0001", email: "parent@gracefield.test", address: "East Legon, Accra", notes: "Prefers SMS reminders." },
  { id: "fam-2", schoolId: school.id, guardianName: "Kwame Asare", phone: "+233 24 111 0002", email: "kwame@example.test", address: "Adenta, Accra", notes: "On payment plan." },
  { id: "fam-3", schoolId: school.id, guardianName: "Efua Sarpong", phone: "+233 24 111 0003", email: "efua@example.test", address: "Dansoman, Accra", notes: "Pays by bank transfer." },
  { id: "fam-4", schoolId: school.id, guardianName: "Yaw Prempeh", phone: "+233 24 111 0004", email: "yaw@example.test", address: "Madina, Accra", notes: "Needs printed receipts." },
  { id: "fam-5", schoolId: school.id, guardianName: "Akosua Owusu", phone: "+233 24 111 0005", email: "akosua@example.test", address: "Tema Community 11", notes: "Transport user." },
  { id: "fam-6", schoolId: school.id, guardianName: "Joseph Nartey", phone: "+233 24 111 0006", email: "joseph@example.test", address: "Spintex, Accra", notes: "Full payment received." }
];

export const students: Student[] = [
  { id: "stu-1", schoolId: school.id, familyId: "fam-1", classId: "class-5", firstName: "Ama", lastName: "Boateng", studentCode: "GPS-B1-001", status: "active", optionalServices: ["feeding"] },
  { id: "stu-2", schoolId: school.id, familyId: "fam-1", classId: "class-3", firstName: "Kojo", lastName: "Boateng", studentCode: "GPS-KG1-014", status: "active", optionalServices: ["feeding", "transport"] },
  { id: "stu-3", schoolId: school.id, familyId: "fam-2", classId: "class-11", firstName: "Nana", lastName: "Asare", studentCode: "GPS-J1-003", status: "active", optionalServices: ["extra classes"] },
  { id: "stu-4", schoolId: school.id, familyId: "fam-2", classId: "class-8", firstName: "Kofi", lastName: "Asare", studentCode: "GPS-B4-010", status: "active", optionalServices: ["feeding"] },
  { id: "stu-5", schoolId: school.id, familyId: "fam-3", classId: "class-13", firstName: "Esi", lastName: "Sarpong", studentCode: "GPS-J3-002", status: "active", optionalServices: ["books"] },
  { id: "stu-6", schoolId: school.id, familyId: "fam-3", classId: "class-10", firstName: "Yaw", lastName: "Sarpong", studentCode: "GPS-B6-020", status: "active", optionalServices: ["transport"] },
  { id: "stu-7", schoolId: school.id, familyId: "fam-4", classId: "class-6", firstName: "Afia", lastName: "Prempeh", studentCode: "GPS-B2-009", status: "active", optionalServices: ["feeding"] },
  { id: "stu-8", schoolId: school.id, familyId: "fam-4", classId: "class-2", firstName: "Kwaku", lastName: "Prempeh", studentCode: "GPS-N2-006", status: "active", optionalServices: ["feeding", "transport"] },
  { id: "stu-9", schoolId: school.id, familyId: "fam-5", classId: "class-7", firstName: "Adwoa", lastName: "Owusu", studentCode: "GPS-B3-022", status: "active", optionalServices: ["transport"] },
  { id: "stu-10", schoolId: school.id, familyId: "fam-5", classId: "class-4", firstName: "Kwesi", lastName: "Owusu", studentCode: "GPS-KG2-018", status: "active", optionalServices: ["feeding"] },
  { id: "stu-11", schoolId: school.id, familyId: "fam-6", classId: "class-12", firstName: "Mansa", lastName: "Nartey", studentCode: "GPS-J2-007", status: "active", optionalServices: ["extra classes"] },
  { id: "stu-12", schoolId: school.id, familyId: "fam-6", classId: "class-9", firstName: "Selorm", lastName: "Nartey", studentCode: "GPS-B5-012", status: "active", optionalServices: ["feeding"] }
];

export const feeItems: FeeItem[] = [
  { id: "fee-tuition", schoolId: school.id, name: "Tuition", category: "tuition", required: true, defaultDueDate: "2026-02-15", description: "Main teaching fee for the term." },
  { id: "fee-feeding", schoolId: school.id, name: "Feeding", category: "feeding", required: false, defaultDueDate: "2026-02-15", description: "Lunch service for selected children." },
  { id: "fee-transport", schoolId: school.id, name: "Transport", category: "transport", required: false, defaultDueDate: "2026-02-15", description: "School bus service." },
  { id: "fee-books", schoolId: school.id, name: "Books", category: "books", required: true, defaultDueDate: "2026-02-15", description: "Term learning materials." },
  { id: "fee-exam", schoolId: school.id, name: "Examination Fee", category: "examination", required: true, defaultDueDate: "2026-03-15", description: "Assessment and printing fee." }
];

export const feeRules: FeeRule[] = classes.flatMap((classRoom, index) => {
  const base = 950 + index * 70;
  return [
    { id: `rule-${classRoom.id}-tuition`, schoolId: school.id, termId: "term-2026-1", classId: classRoom.id, feeItemId: "fee-tuition", amount: base, required: true, dueDate: "2026-02-15" },
    { id: `rule-${classRoom.id}-books`, schoolId: school.id, termId: "term-2026-1", classId: classRoom.id, feeItemId: "fee-books", amount: 220, required: true, dueDate: "2026-02-15" },
    { id: `rule-${classRoom.id}-exam`, schoolId: school.id, termId: "term-2026-1", classId: classRoom.id, feeItemId: "fee-exam", amount: 150, required: true, dueDate: "2026-03-15" },
    { id: `rule-${classRoom.id}-feeding`, schoolId: school.id, termId: "term-2026-1", classId: classRoom.id, feeItemId: "fee-feeding", amount: 480, required: false, dueDate: "2026-02-15" },
    { id: `rule-${classRoom.id}-transport`, schoolId: school.id, termId: "term-2026-1", classId: classRoom.id, feeItemId: "fee-transport", amount: 650, required: false, dueDate: "2026-02-15" }
  ];
});

const billTotals = [2540, 3190, 2090, 1950, 2160, 2860, 2020, 2670, 2300, 1870, 2510, 2290];
const billPaid = [1200, 900, 1200, 700, 2160, 1500, 800, 600, 0, 1400, 2510, 2290];

export const bills: Bill[] = students.map((student, index) => {
  const totalAmount = billTotals[index];
  const paidAmount = billPaid[index];
  const status = paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partially_paid" : index === 8 ? "overdue" : "published";
  return {
    id: `bill-${index + 1}`,
    schoolId: school.id,
    familyId: student.familyId,
    studentId: student.id,
    termId: "term-2026-1",
    billNumber: `BILL-2026-${String(index + 1).padStart(4, "0")}`,
    status,
    totalAmount,
    paidAmount,
    dueDate: index === 8 ? "2026-02-01" : "2026-02-15",
    publishedAt: "2026-01-10"
  };
});

export const billItems: BillItem[] = bills.flatMap((bill) => [
  { id: `${bill.id}-tuition`, billId: bill.id, feeItemId: "fee-tuition", description: "Tuition", amount: Math.max(900, bill.totalAmount - 850) },
  { id: `${bill.id}-books`, billId: bill.id, feeItemId: "fee-books", description: "Books", amount: 220 },
  { id: `${bill.id}-exam`, billId: bill.id, feeItemId: "fee-exam", description: "Examination Fee", amount: 150 },
  { id: `${bill.id}-service`, billId: bill.id, feeItemId: "fee-feeding", description: "Optional services", amount: bill.totalAmount - Math.max(900, bill.totalAmount - 850) - 370 }
]);

export const payments: Payment[] = [
  { id: "pay-1", schoolId: school.id, familyId: "fam-1", studentId: "stu-1", billId: "bill-1", amount: 1200, method: "mobile money", reference: "MOMO-82101", paymentDate: "2026-01-18", recordedBy: "Kojo Appiah" },
  { id: "pay-2", schoolId: school.id, familyId: "fam-1", studentId: "stu-2", billId: "bill-2", amount: 900, method: "cash", reference: "CASH-112", paymentDate: "2026-01-20", recordedBy: "Kojo Appiah" },
  { id: "pay-3", schoolId: school.id, familyId: "fam-2", studentId: "stu-3", billId: "bill-3", amount: 1200, method: "bank transfer", reference: "BT-7781", paymentDate: "2026-01-21", recordedBy: "Abena Osei" },
  { id: "pay-4", schoolId: school.id, familyId: "fam-3", studentId: "stu-5", billId: "bill-5", amount: 2160, method: "bank transfer", reference: "BT-8011", paymentDate: "2026-01-25", recordedBy: "Abena Osei" },
  { id: "pay-5", schoolId: school.id, familyId: "fam-6", studentId: "stu-11", billId: "bill-11", amount: 2510, method: "card/POS", reference: "POS-201", paymentDate: "2026-01-26", recordedBy: "Kojo Appiah" },
  { id: "pay-6", schoolId: school.id, familyId: "fam-6", studentId: "stu-12", billId: "bill-12", amount: 2290, method: "mobile money", reference: "MOMO-90021", paymentDate: "2026-01-27", recordedBy: "Kojo Appiah" },
  { id: "pay-7", schoolId: school.id, familyId: "fam-5", studentId: "stu-10", billId: "bill-10", amount: 1400, method: "cash", reference: "CASH-130", paymentDate: "2026-01-27", recordedBy: "Kojo Appiah" }
];

export const receipts: Receipt[] = payments.map((payment, index) => ({
  id: `rcpt-${index + 1}`,
  schoolId: payment.schoolId,
  familyId: payment.familyId,
  studentId: payment.studentId,
  paymentId: payment.id,
  receiptNumber: `RCPT-2026-${String(index + 1).padStart(4, "0")}`,
  amount: payment.amount,
  method: payment.method,
  reference: payment.reference,
  date: payment.paymentDate,
  recordedBy: payment.recordedBy
}));

export const paymentPlans: PaymentPlan[] = [
  { id: "plan-1", schoolId: school.id, familyId: "fam-2", totalBalance: 2140, status: "active", approvedBy: "Abena Osei", notes: "Guardian will pay in three instalments before end of term." }
];

export const paymentPlanInstallments: PaymentPlanInstallment[] = [
  { id: "inst-1", planId: "plan-1", dueDate: "2026-02-15", amount: 700, paidAmount: 700, status: "paid" },
  { id: "inst-2", planId: "plan-1", dueDate: "2026-03-15", amount: 720, paidAmount: 0, status: "pending" },
  { id: "inst-3", planId: "plan-1", dueDate: "2026-04-05", amount: 720, paidAmount: 0, status: "pending" }
];

export const reminderTemplates: ReminderTemplate[] = [
  { id: "tpl-1", schoolId: school.id, name: "Polite balance reminder", type: "arrears reminder", channel: "both", body: "Dear Parent, your current school fee balance is GHS {{balance}}. Kindly arrange payment by {{due_date}}. Thank you." },
  { id: "tpl-2", schoolId: school.id, name: "Family balance reminder", type: "family reminder", channel: "sms", body: "Dear {{guardian_name}}, your total family balance for {{children_names}} is GHS {{balance}}. Please contact the accounts office if you need a payment plan." },
  { id: "tpl-3", schoolId: school.id, name: "Payment plan instalment", type: "payment plan instalment reminder", channel: "both", body: "Dear {{guardian_name}}, your next payment plan instalment of GHS {{amount}} is due on {{due_date}}. Thank you." },
  { id: "tpl-4", schoolId: school.id, name: "Receipt confirmation", type: "receipt confirmation", channel: "both", body: "Dear {{guardian_name}}, we have received GHS {{amount}}. Receipt {{receipt_number}} is now available in your parent portal." }
];

export const reminders: Reminder[] = [
  { id: "rem-1", schoolId: school.id, familyId: "fam-1", templateId: "tpl-1", channel: "sms", status: "sent", message: "Dear Parent, your current school fee balance is GHS 3,630. Kindly arrange payment by 15 Feb 2026. Thank you.", sentAt: "2026-01-28" },
  { id: "rem-2", schoolId: school.id, familyId: "fam-2", templateId: "tpl-3", channel: "both", status: "sent", message: "Dear Kwame Asare, your next payment plan instalment of GHS 720 is due on 15 Mar 2026. Thank you.", sentAt: "2026-02-01" },
  { id: "rem-3", schoolId: school.id, familyId: "fam-5", templateId: "tpl-2", channel: "email", status: "scheduled", message: "Family balance reminder scheduled for Akosua Owusu." }
];

export const platformSchools = [
  { ...school, users: 5, students: 12 },
  { id: "school-hillside", name: "Hillside Academy", address: "Kumasi", phone: "+233 32 000 2222", email: "admin@hillside.test", currency: "GHS", status: "active" as const, plan: "starter" as const, users: 3, students: 186 },
  { id: "school-bright", name: "Bright Star School", address: "Cape Coast", phone: "+233 33 000 2222", email: "admin@bright.test", currency: "GHS", status: "inactive" as const, plan: "premium" as const, users: 9, students: 421 }
];
