import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 font-sans text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
