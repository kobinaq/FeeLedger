/** FormData helpers for server actions. */

export function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

export function values(formData: FormData, key: string) {
  return formData.getAll(key).map(String).filter(Boolean);
}
