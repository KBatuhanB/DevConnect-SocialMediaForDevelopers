import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, hasError = false, ...props },
  ref
) {
  return <textarea className={cn("ui-textarea", hasError && "ui-input-error", className)} ref={ref} {...props} />;
});