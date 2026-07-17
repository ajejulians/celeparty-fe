import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
	<textarea
		className={cn(
			"flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 font-sans text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 resize-none",
			className,
		)}
		ref={ref}
		{...props}
	/>
));
Textarea.displayName = "Textarea";

export { Textarea };
