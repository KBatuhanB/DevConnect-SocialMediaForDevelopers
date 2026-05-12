import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError = false, ...props },
  ref
) {
  return <input className={cn("ui-input", hasError && "ui-input-error", className)} ref={ref} {...props} />;
});