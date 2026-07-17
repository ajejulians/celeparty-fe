import type { ReactNode } from "react";

interface EmptyStateProps {
	icon: ReactNode;
	title: string;
	description: string;
	action?: { label: string; onClick: () => void };
}

export function EmptyState({
	icon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
				{typeof icon === "string" ? (
					<span className="text-3xl">{icon}</span>
				) : (
					icon
				)}
			</div>
			<h3 className="font-quick font-semibold text-neutral-900 text-lg mb-1">
				{title}
			</h3>
			<p className="font-sans text-sm text-neutral-500 max-w-sm">
				{description}
			</p>
			{action && (
				<button
					onClick={action.onClick}
					className="mt-4 px-6 py-2.5 bg-c-green text-neutral-900 font-quick font-semibold text-sm rounded-lg hover:brightness-95 transition-all"
				>
					{action.label}
				</button>
			)}
		</div>
	);
}
