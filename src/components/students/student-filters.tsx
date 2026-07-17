"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Select } from "@/components/ui/input";

export function StudentFilters({
  classes
}: {
  classes: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}?${next.toString()}`));
  }

  return (
    <>
      <Select
        value={searchParams.get("classId") ?? ""}
        disabled={pending}
        onChange={(event) => update("classId", event.target.value)}
        aria-label="Filter by class"
      >
        <option value="">All classes</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get("status") ?? "active"}
        disabled={pending}
        onChange={(event) => update("status", event.target.value)}
        aria-label="Filter by status"
      >
        <option value="active">Active students</option>
        <option value="archived">Archived students</option>
        <option value="all">All students</option>
      </Select>
    </>
  );
}
