import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-signal text-on-dark hover:bg-signal/90",
  secondary: "bg-transparent text-on-dark border border-border hover:bg-elevated",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-button px-6 py-3.5 font-sans text-sm font-bold transition-colors",
          "disabled:cursor-not-allowed disabled:bg-elevated disabled:text-faint disabled:border-0 disabled:hover:bg-elevated",
          !disabled && variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
