import { ParentShell } from "@/components/layout/parent-shell";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <ParentShell>{children}</ParentShell>;
}
