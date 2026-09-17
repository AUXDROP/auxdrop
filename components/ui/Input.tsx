import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
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

Input.displayName = "Input";
