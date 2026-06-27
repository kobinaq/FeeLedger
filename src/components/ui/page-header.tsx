import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: string;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-slate-950">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p>
      </div>
      {action ? <Button>{action}</Button> : null}
    </div>
  );
}
