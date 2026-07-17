"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker, type DropdownProps } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const navButtonShared = cn(
	buttonVariants({ variant: "outline" }),
	"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
);

function CustomSelectDropdown({
	value,
	onChange,
	options,
	"aria-label": ariaLabel,
}: DropdownProps) {
	const handleValueChange = (newValue: string) => {
		if (onChange) {
			const event = {
				target: { value: newValue },
			} as React.ChangeEvent<HTMLSelectElement>;
			onChange(event);
		}
	};

	return (
		<Select value={value?.toString()} onValueChange={handleValueChange}>
			<SelectTrigger
				className="h-7 w-auto min-w-[100px] px-2 py-0 text-xs border-0 bg-transparent hover:bg-neutral-100 focus:ring-0 shadow-none font-sans font-medium capitalize gap-1"
				aria-label={ariaLabel}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="max-h-60 z-50">
				{options?.map((option) => (
					<SelectItem
						key={option.value}
						value={option.value.toString()}
						disabled={option.disabled}
						className="text-xs font-sans capitalize"
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "dropdown",
	startMonth = new Date(new Date().getFullYear() - 10, 0),
	endMonth = new Date(new Date().getFullYear() + 10, 11),
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			captionLayout={captionLayout}
			startMonth={startMonth}
			endMonth={endMonth}
			className={cn("p-3 select-none", className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4 relative",
				month_caption: "flex justify-center pt-1 pl-1 items-center h-7",
				caption_label: "hidden",
				nav: "absolute top-1 left-2 right-0 flex items-center justify-between pointer-events-none z-10",
				button_previous: cn(navButtonShared, "pointer-events-auto"),
				button_next: cn(navButtonShared, "pointer-events-auto"),
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex",
				weekday:
					"text-neutral-500 rounded-md w-9 font-sans font-normal text-[0.8rem]",
				week: "flex w-full mt-2",
				day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-neutral-100/50 [&:has([aria-selected])]:bg-neutral-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day_button: cn(
					buttonVariants({ variant: "ghost" }),
					"h-9 w-9 p-0 font-sans font-normal aria-selected:opacity-100",
				),
				range_end: "day-range-end",
				selected:
					"bg-c-blue text-white hover:bg-c-blue hover:text-white focus:bg-c-blue focus:text-white",
				today: "bg-neutral-100 text-neutral-900",
				outside:
					"day-outside text-neutral-400 opacity-75 aria-selected:bg-neutral-100/50 aria-selected:text-neutral-500 aria-selected:opacity-30",
				disabled: "text-neutral-500 opacity-50",
				range_middle:
					"aria-selected:bg-neutral-100 aria-selected:text-neutral-900",
				hidden: "invisible",
				dropdowns: "flex justify-center gap-1.5 items-center",
				dropdown_root: "relative inline-flex items-center",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) =>
					orientation === "left" ? (
						<ChevronLeft className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					),
				Dropdown: CustomSelectDropdown,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
