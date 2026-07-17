import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-brand-green text-white shadow-soft hover:bg-brand-greenDark hover:shadow-lift",
    secondary: "border border-brand-line bg-white text-brand-ink shadow-sm hover:border-brand-green/30 hover:bg-brand-greenSoft",
    ghost: "text-brand-muted hover:bg-brand-mist hover:text-brand-ink",
    danger: "bg-brand-danger text-white shadow-sm hover:bg-red-800"
  };
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-normal transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-amber focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
