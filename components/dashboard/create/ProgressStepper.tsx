import { Check } from "lucide-react";

interface ProgressStepperProps {
    currentStep: number;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
    const totalSteps = 6;

    return (
        <div className="w-full py-6 mb-8 border-b border-border/40">
            <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border/50 -z-10" />
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-300 -z-10"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = currentStep > stepNumber;

                    return (
                        <div key={index} className="flex flex-col items-center gap-2 relative z-10 bg-background px-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors border-2
                                    ${isActive ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                        : isCompleted ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-card text-muted-foreground"}`}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between max-w-3xl mx-auto mt-3 px-2 text-xs font-medium text-muted-foreground">
                <span className={currentStep >= 1 ? "text-primary" : ""}>Niche</span>
                <span className={currentStep >= 2 ? "text-primary" : ""}>Language & Voice</span>
                <span className={currentStep >= 3 ? "text-primary" : ""}>Music</span>
                <span className={currentStep >= 4 ? "text-primary" : ""}>Visuals</span>
                <span className={currentStep >= 5 ? "text-primary" : ""}>Captions</span>
                <span className={currentStep >= 6 ? "text-primary" : ""}>Review</span>
            </div>
        </div>
    );
}
