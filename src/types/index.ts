export type Role =
  | "platform_admin"
  | "school_admin"
  | "headteacher"
  | "accountant"
  | "cashier"
  | "parent";

export type BillStatus = "draft" | "published" | "partially_paid" | "paid" | "overdue" | "cancelled";
export type PlanStatus = "active" | "on_track" | "missed_payment" | "completed" | "cancelled";
export type InstallmentStatus = "pending" | "partially_paid" | "paid" | "overdue";
export type ReminderStatus = "draft" | "scheduled" | "sent" | "partial" | "failed";
export type Channel = "sms" | "email" | "both";

export type School = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  status: "active" | "inactive";
  plan: "starter" | "growth" | "premium";
};

export type Profile = {
  id: string;
  schoolId?: string;
  familyId?: string;
  fullName: string;
  email: string;
  role: Role;
};

export type ClassRoom = {
  id: string;
  schoolId: string;
  name: string;
};

export type Family = {
  id: string;
  schoolId: string;
  guardianName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

export type Student = {
  id: string;
  schoolId: string;
  familyId: string;
  classId: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  status: "active" | "archived";
  optionalServices: string[];
  notes?: string;
};

export type FeeItem = {
  id: string;
  schoolId: string;
  name: string;
  category: string;
  required: boolean;
  defaultDueDate: string;
  description: string;
};

export type FeeRule = {
  id: string;
  schoolId: string;
  termId: string;
  classId: string;
  feeItemId: string;
  amount: number;
  required: boolean;
  dueDate: string;
};

export type BillItem = {
  id: string;
  billId: string;
  feeItemId: string;
  description: string;
  amount: number;
};

export type Bill = {
  id: string;
  schoolId: string;
  familyId: string;
  studentId: string;
  termId: string;
  billNumber: string;
  status: BillStatus;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  publishedAt?: string;
};

export type Payment = {
  id: string;
  schoolId: string;
  familyId: string;
  studentId?: string;
  billId?: string;
  amount: number;
  method: "cash" | "mobile money" | "bank transfer" | "cheque" | "card/POS" | "other";
  reference: string;
  paymentDate: string;
  recordedBy: string;
  notes?: string;
};

export type Receipt = {
  id: string;
  schoolId: string;
  familyId: string;
  studentId?: string;
  paymentId: string;
  receiptNumber: string;
  amount: number;
  method: Payment["method"];
  reference: string;
  date: string;
  recordedBy: string;
};

export type PaymentPlan = {
  id: string;
  schoolId: string;
  familyId: string;
  totalBalance: number;
  status: PlanStatus;
  approvedBy: string;
  notes: string;
};

export type PaymentPlanInstallment = {
  id: string;
  planId: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
};

export type ReminderTemplate = {
  id: string;
  schoolId: string;
  name: string;
  type: string;
  channel: Channel;
  body: string;
};

export type Reminder = {
  id: string;
  schoolId: string;
  familyId: string;
  templateId: string;
  channel: Channel;
  status: ReminderStatus;
  message: string;
  sentAt?: string;
};
