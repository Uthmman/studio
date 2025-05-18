
"use client";

import type { FurnitureFeatureConfig, UserSelections, FurnitureCategory } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import NextImage from 'next/image'; // Renamed import
import * as LucideIcons from 'lucide-react';

interface FeatureSelectorProps {
  features: FurnitureFeatureConfig[];
  currentSelections: UserSelections['featureSelections'];
  onFeatureSelect: (featureId: string, optionId: string, isSelected?: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  categoryName: string;
  categoryImageURL: string;
  categoryImageAiHint: string;
  allCategories: FurnitureCategory[];
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
}: FeatureSelectorProps) {

  const allFeaturesSelected = features.every(feature => {
    const selection = currentSelections[feature.id];
    if (feature.selectionType === 'multiple') {
      return feature.options.length === 0 || (Array.isArray(selection) && selection.length > 0);
    }
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
            <NextImage // Changed to NextImage
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
                    const IconComponent = option.iconName ? (LucideIcons as any)[option.iconName] || LucideIcons.Minus : null;
                    const isChecked = Array.isArray(currentSelections[feature.id]) && (currentSelections[feature.id] as string[]).includes(option.id);
                    return (
                      <Label
                        key={option.id}
                        htmlFor={`${feature.id}-${option.id}`}
                        className="flex items-start space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary"
                      >
                        <Checkbox
                          id={`${feature.id}-${option.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => onFeatureSelect(feature.id, option.id, !!checked)}
                          className="mt-1" // Align checkbox better if images make label taller
                        />
                        <div className="flex flex-col items-start">
                           <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-5 w-5 text-current" />}
                            <span>{option.label}</span>
                           </div>
                          {option.imagePlaceholder && (
                            <div className="mt-2 relative w-20 h-20 rounded-md border overflow-hidden bg-muted">
                              <NextImage // Changed to NextImage
                                src={option.imagePlaceholder}
                                alt={option.label}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="80px"
                                data-ai-hint={option.imageAiHint || option.label}
                                className="p-1"
                              />
                            </div>
                          )}
                        </div>
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
                    const IconComponent = option.iconName ? (LucideIcons as any)[option.iconName] || LucideIcons.Minus : null;
                    return (
                      <Label
                        key={option.id}
                        htmlFor={`${feature.id}-${option.id}`}
                        className="flex items-start space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary"
                      >
                        <RadioGroupItem value={option.id} id={`${feature.id}-${option.id}`} className="mt-1" />
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                                {IconComponent && <IconComponent className="h-5 w-5 text-current" />}
                                <span>{option.label}</span>
                            </div>
                          {option.imagePlaceholder && (
                            <div className="mt-2 relative w-20 h-20 rounded-md border overflow-hidden bg-muted">
                              <NextImage // Changed to NextImage
                                src={option.imagePlaceholder}
                                alt={option.label}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="80px"
                                data-ai-hint={option.imageAiHint || option.label}
                                className="p-1"
                              />
                            </div>
                          )}
                        </div>
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
