import { cn } from "../../lib/cn";

export function Card({
  children,
  className,
  accent = false
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return <section className={cn("ui-card", accent && "ui-card-accent", className)}>{children}</section>;
}