import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-quick font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] disabled:active:scale-100 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-c-blue text-white hover:bg-c-blue/90",
        destructive: "bg-c-red text-white hover:bg-c-red/90",
        outline: "border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        ghost: "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900",
        link: "text-c-blue underline-offset-4 hover:underline",
        cta: "bg-c-green text-neutral-900 hover:brightness-95 hover:shadow-md",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 min-h-[36px] rounded-md px-4 text-xs",
        lg: "h-14 rounded-md px-8 py-4 text-base",
        icon: "h-11 w-11 p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
