import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-input border bg-elevated px-4 py-3.5 font-sans text-[13px] text-on-dark placeholder:text-faint",
          "outline-none focus:border-accent",
          error ? "border-status-error" : "border-border",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
