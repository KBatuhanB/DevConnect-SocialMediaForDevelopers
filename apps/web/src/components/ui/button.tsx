import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

export function getButtonClassName(variant: ButtonVariant = "primary", fullWidth = false) {
  return cn(
    "ui-button",
    variant === "primary" && "ui-button-primary",
    variant === "secondary" && "ui-button-secondary",
    variant === "ghost" && "ui-button-ghost",
    fullWidth && "ui-button-full"
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({ className, variant = "primary", fullWidth = false, ...props }: ButtonProps) {
  return <button className={cn(getButtonClassName(variant, fullWidth), className)} {...props} />;
}