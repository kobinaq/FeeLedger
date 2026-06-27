import { z } from "zod";

export const familySchema = z.object({
  guardianName: z.string().min(2, "Enter the guardian name"),
  phone: z.string().min(8, "Enter a phone number"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(2, "Enter an address")
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
  amount: z.coerce.number().positive("Amount must be more than zero"),
  method: z.string().min(1),
  reference: z.string().min(2)
});

export const paymentPlanSchema = z.object({
  familyId: z.string().min(1),
  totalBalance: z.coerce.number().positive(),
  installments: z.array(z.object({ dueDate: z.string(), amount: z.coerce.number().positive() })).min(1)
});
