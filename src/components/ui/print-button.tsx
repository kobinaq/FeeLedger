"use client";

import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Print Receipt" }: { label?: string }) {
  return (
    <Button type="button" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
