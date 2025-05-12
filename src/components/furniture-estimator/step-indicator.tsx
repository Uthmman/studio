"use client";

import type { Step } from "@/lib/definitions";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: Step;
  totalSteps?: number; // Typically 3 for core flow (cat, feat, size) then result
}

const stepLabels: Record<Step, string> = {
  category: "Category Selection",
  features: "Feature Customization",
  size: "Size Selection",
  result: "Price Estimate",
};

const stepNumbers: Record<Step, number> = {
  category: 1,
  features: 2,
  size: 3,
  result: 4,
};

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const totalDisplaySteps = 3; // Category, Features, Size are the main user input steps
  const currentStepNumber = stepNumbers[currentStep];
  const currentStepLabel = stepLabels[currentStep];

  return (
    <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">
          {currentStepNumber <= totalDisplaySteps ? `Step ${currentStepNumber} of ${totalDisplaySteps}: ` : ''}
          {currentStepLabel}
        </h3>
      </div>
      {currentStepNumber <= totalDisplaySteps && (
        <div className="mt-2 w-full bg-muted rounded-full h-2.5">
          <div
            className={cn(
              "bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            )}
            style={{ width: `${(currentStepNumber / totalDisplaySteps) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
