"use client";

import type { FurnitureFeatureConfig, UserSelections } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FeatureSelectorProps {
  features: FurnitureFeatureConfig[];
  currentSelections: UserSelections['featureSelections'];
  onFeatureSelect: (featureId: string, optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
  categoryName: string;
}

export default function FeatureSelector({ features, currentSelections, onFeatureSelect, onNext, onBack, categoryName }: FeatureSelectorProps) {
  const allFeaturesSelected = features.every(feature => currentSelections[feature.id]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Customize Your {categoryName}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">Select the desired features for your {categoryName.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {features.map((feature) => (
          <div key={feature.id} className="space-y-3 p-4 border rounded-lg shadow-sm bg-background">
            <Label htmlFor={feature.id} className="text-lg font-medium text-foreground">{feature.name}</Label>
            <RadioGroup
              id={feature.id}
              value={currentSelections[feature.id]}
              onValueChange={(value) => onFeatureSelect(feature.id, value)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
            >
              {feature.options.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={`${feature.id}-${option.id}`}
                  className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary"
                >
                  <RadioGroupItem value={option.id} id={`${feature.id}-${option.id}`} />
                  <span>{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        ))}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>Back to Categories</Button>
          <Button onClick={onNext} disabled={!allFeaturesSelected}>
            Next to Sizes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
