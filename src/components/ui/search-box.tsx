import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({ placeholder = "Search" }: { placeholder?: string }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
      <Input className="pl-9" placeholder={placeholder} />
    </label>
  );
}
