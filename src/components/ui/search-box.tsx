"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";

export function SearchBox({ placeholder = "Search", param = "q" }: { placeholder?: string; param?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const current = searchParams.get(param) ?? "";

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        className="pl-9"
        placeholder={placeholder}
        defaultValue={current}
        disabled={pending}
        onChange={(event) => {
          const value = event.target.value;
          const next = new URLSearchParams(searchParams.toString());
          if (value) next.set(param, value);
          else next.delete(param);
          startTransition(() => {
            router.replace(`${pathname}?${next.toString()}`);
          });
        }}
      />
    </div>
  );
}
