import { z } from "zod";

export const familySchema = z.object({
  guardianName: z.string().min(2, "Enter the guardian name"),
  phone: z.string().min(8, "Enter a phone number"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(2, "Enter an address"),
  notes: z.string().optional()
});

export const studentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  studentCode: z.string().min(2),
  classId: z.string().min(1),
  familyId: z.string().min(1)
});

export const paymentSchema = z.object({
  familyId: z.string().min(1),
  studentId: z.string().optional(),
  billId: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be more than zero"),
  method: z.string().min(1),
  reference: z.string().min(2),
  paymentDate: z.string().optional(),
  notes: z.string().optional()
});

export const paymentPlanSchema = z.object({
  familyId: z.string().min(1),
  totalBalance: z.coerce.number().positive(),
  installments: z.array(z.object({ dueDate: z.string(), amount: z.coerce.number().positive() })).min(1)
});

export const feeItemSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  required: z.coerce.boolean().default(false),
  defaultDueDate: z.string().optional(),
  description: z.string().optional()
});

export const feeRuleSchema = z.object({
  termId: z.string().min(1),
  classId: z.string().min(1),
  feeItemId: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  required: z.coerce.boolean().default(false),
  dueDate: z.string().min(1)
});

export const reminderSchema = z.object({
  familyId: z.string().min(1),
  templateId: z.string().optional(),
  channel: z.enum(["sms", "email", "both"]),
  message: z.string().min(5)
});

export const schoolSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  currency: z.string().default("GHS")
});
