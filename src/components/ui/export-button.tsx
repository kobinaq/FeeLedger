"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButton({ label = "Export CSV" }: { label?: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        const blob = new Blob(["FeeLedger demo export\n"], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "feeledger-report.csv";
        link.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
