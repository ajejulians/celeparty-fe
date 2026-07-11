import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <nav aria-label="Langkah checkout" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isLast = i === steps.length - 1;

          return (
            <li
              key={step}
              className={cn(
                "flex items-center",
                !isLast && "flex-1"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-quick font-bold transition-colors duration-200",
                    isCompleted && "bg-c-blue text-white",
                    isCurrent && "bg-c-blue text-white ring-2 ring-c-blue/30",
                    !isCompleted && !isCurrent && "bg-neutral-100 text-neutral-400"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "font-quick font-semibold text-sm hidden sm:inline",
                    isCompleted && "text-c-blue",
                    isCurrent && "text-neutral-900",
                    !isCompleted && !isCurrent && "text-neutral-400"
                  )}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3",
                    i < currentStep ? "bg-c-blue" : "bg-neutral-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
