
"use client";

import type { FurnitureFeatureConfig, UserSelections, FurnitureCategory } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';

interface FeatureSelectorProps {
  features: FurnitureFeatureConfig[];
  currentSelections: UserSelections['featureSelections'];
  onFeatureSelect: (featureId: string, optionId: string, isSelected?: boolean) => void; // isSelected for checkboxes
  onNext: () => void;
  onBack: () => void;
  categoryName: string;
  categoryImageURL: string;
  categoryImageAiHint: string;
  allCategories: FurnitureCategory[]; // Keep if needed for context, or remove if not used
}

export default function FeatureSelector({ 
  features, 
  currentSelections, 
  onFeatureSelect, 
  onNext, 
  onBack, 
  categoryName,
  categoryImageURL,
  categoryImageAiHint,
  // allCategories // currently unused
}: FeatureSelectorProps) {

  const allFeaturesSelected = features.every(feature => {
    const selection = currentSelections[feature.id];
    if (feature.selectionType === 'multiple') {
      // For multi-select, considered "selected" if it has options and at least one is chosen,
      // or if it has no options (vacuously true).
      return feature.options.length === 0 || (Array.isArray(selection) && selection.length > 0);
    }
    // For single-select, must have a non-empty string selection.
    return !!selection;
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Customize Your {categoryName}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">Select the desired features for your {categoryName.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-md mb-6 border">
            <Image
              src={categoryImageURL}
              alt={`${categoryName} representative image`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={categoryImageAiHint}
              priority
            />
          </div>
        <div className="space-y-8">
          {features.map((feature) => (
            <div key={feature.id} className="space-y-3 p-4 border rounded-lg shadow-sm bg-background">
              <Label htmlFor={feature.id} className="text-lg font-medium text-foreground">{feature.name} ({feature.selectionType === 'multiple' ? 'select multiple' : 'select one'})</Label>
              {feature.selectionType === 'multiple' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {feature.options.map((option) => {
                    const IconComponent = option.iconName ? (LucideIcons as any)[option.iconName] || LucideIcons.Minus : LucideIcons.Minus;
                    const isChecked = Array.isArray(currentSelections[feature.id]) && (currentSelections[feature.id] as string[]).includes(option.id);
                    return (
                      <Label
                        key={option.id}
                        htmlFor={`${feature.id}-${option.id}`}
                        className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary"
                      >
                        <Checkbox
                          id={`${feature.id}-${option.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => onFeatureSelect(feature.id, option.id, !!checked)}
                        />
                        <IconComponent className="h-5 w-5 text-current" />
                        <span>{option.label}</span>
                      </Label>
                    );
                  })}
                </div>
              ) : (
                <RadioGroup
                  id={feature.id}
                  value={currentSelections[feature.id] as string || ''}
                  onValueChange={(value) => onFeatureSelect(feature.id, value)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                >
                  {feature.options.map((option) => {
                    const IconComponent = option.iconName ? (LucideIcons as any)[option.iconName] || LucideIcons.Minus : LucideIcons.Minus;
                    return (
                      <Label
                        key={option.id}
                        htmlFor={`${feature.id}-${option.id}`}
                        className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary"
                      >
                        <RadioGroupItem value={option.id} id={`${feature.id}-${option.id}`} />
                        <IconComponent className="h-5 w-5 text-current" />
                        <span>{option.label}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          ))}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>Back to Categories</Button>
            <Button onClick={onNext} disabled={!allFeaturesSelected}>
              Next to Sizes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
