import { feeRules, students } from "@/lib/demo-data";
import type { Bill } from "@/types";

export function previewBills(termId: string, classIds: string[]) {
  return students
    .filter((student) => classIds.includes(student.classId))
    .map((student, index) => {
      const rules = feeRules.filter((rule) => rule.termId === termId && rule.classId === student.classId);
      const required = rules.filter((rule) => rule.required);
      const optional = rules.filter((rule) => student.optionalServices.some((service) => rule.feeItemId.includes(service.replace(" ", "-"))));
      const totalAmount = [...required, ...optional].reduce((total, rule) => total + rule.amount, 0);
      return {
        id: `preview-${index + 1}`,
        studentId: student.id,
        familyId: student.familyId,
        totalAmount,
        itemCount: required.length + optional.length,
        status: "draft" as Bill["status"]
      };
    });
}

export async function publishBills() {
  return {
    ok: true,
    published: 12,
    notified: 6,
    message: "Bills published and parent notifications queued by the mock provider."
  };
}
