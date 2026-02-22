import { Button } from "@/components/ui/button";

interface FormFooterProps {
    onNext: () => void;
    onBack: () => void;
    disableNext?: boolean;
    hideBack?: boolean;
    isFinalStep?: boolean;
}

export function FormFooter({
    onNext,
    onBack,
    disableNext = false,
    hideBack = false,
    isFinalStep = false
}: FormFooterProps) {
    return (
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <div>
                {!hideBack && (
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={onBack}
                        className="px-6"
                    >
                        Back
                    </Button>
                )}
            </div>
            <Button
                size="lg"
                className="px-8"
                onClick={onNext}
                disabled={disableNext}
                variant={disableNext ? "secondary" : "default"}
            >
                {isFinalStep && disableNext ? "Scheduling..." : isFinalStep ? "Schedule" : "Continue"}
            </Button>
        </div>
    );
}
