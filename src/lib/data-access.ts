import {
  billItems,
  bills,
  classes,
  families,
  feeItems,
  feeRules,
  paymentPlanInstallments,
  paymentPlans,
  payments,
  receipts,
  reminders,
  school,
  students
} from "@/lib/demo-data";

export function getClassName(id: string) {
  return classes.find((item) => item.id === id)?.name ?? "Class";
}

export function getStudent(id?: string) {
  return students.find((item) => item.id === id);
}

export function getFamily(id?: string) {
  return families.find((item) => item.id === id);
}

export function getBill(id?: string) {
  return bills.find((item) => item.id === id);
}

export function getFamilyStudents(familyId: string) {
  return students.filter((student) => student.familyId === familyId);
}

export function getFamilyBills(familyId: string) {
  return bills.filter((bill) => bill.familyId === familyId);
}

export function getFamilyPayments(familyId: string) {
  return payments.filter((payment) => payment.familyId === familyId);
}

export function getFamilyReceipts(familyId: string) {
  return receipts.filter((receipt) => receipt.familyId === familyId);
}

export function getFamilyReminders(familyId: string) {
  return reminders.filter((reminder) => reminder.familyId === familyId);
}

export function getFamilyPlan(familyId: string) {
  const plan = paymentPlans.find((item) => item.familyId === familyId);
  if (!plan) return undefined;
  return {
    ...plan,
    installments: paymentPlanInstallments.filter((item) => item.planId === plan.id)
  };
}

export function getBillItems(billId: string) {
  return billItems.filter((item) => item.billId === billId);
}

export function getFamilyBalance(familyId: string) {
  return getFamilyBills(familyId).reduce((total, bill) => total + bill.totalAmount - bill.paidAmount, 0);
}

export function getFamilyPaid(familyId: string) {
  return getFamilyBills(familyId).reduce((total, bill) => total + bill.paidAmount, 0);
}

export function getDashboardStats() {
  const expected = bills.reduce((total, bill) => total + bill.totalAmount, 0);
  const collected = bills.reduce((total, bill) => total + bill.paidAmount, 0);
  const outstanding = expected - collected;
  const today = payments.filter((payment) => payment.paymentDate === "2026-01-27").reduce((total, payment) => total + payment.amount, 0);
  return {
    expected,
    collected,
    outstanding,
    rate: expected ? (collected / expected) * 100 : 0,
    today,
    activePlans: paymentPlans.filter((plan) => plan.status === "active").length
  };
}

export function getHighestBalanceFamilies() {
  return families
    .map((family) => ({ family, balance: getFamilyBalance(family.id), students: getFamilyStudents(family.id).length }))
    .sort((a, b) => b.balance - a.balance);
}

export function getCollectionByClass() {
  return classes.map((classRoom) => {
    const classStudents = students.filter((student) => student.classId === classRoom.id);
    const classBills = bills.filter((bill) => classStudents.some((student) => student.id === bill.studentId));
    const expected = classBills.reduce((total, bill) => total + bill.totalAmount, 0);
    const collected = classBills.reduce((total, bill) => total + bill.paidAmount, 0);
    return { className: classRoom.name, expected, collected, outstanding: expected - collected };
  });
}

export function getFeeRuleRows() {
  return feeRules.slice(0, 24).map((rule) => ({
    ...rule,
    className: getClassName(rule.classId),
    feeItem: feeItems.find((fee) => fee.id === rule.feeItemId)?.name ?? "Fee item"
  }));
}

export function getReceipt(id?: string) {
  return receipts.find((receipt) => receipt.id === id || receipt.receiptNumber === id);
}

export function getParentFamily() {
  return families[0];
}

export function getSchool() {
  return school;
}
