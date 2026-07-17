"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExportButtonProps = {
  label?: string;
  href: string;
  filename?: string;
};

export function ExportButton({ label = "Export CSV", href }: ExportButtonProps) {
  return (
    <a href={href} download>
      <Button type="button" variant="secondary">
        <Download className="h-4 w-4" />
        {label}
      </Button>
    </a>
  );
}
