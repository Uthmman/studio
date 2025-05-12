"use client";

import type { FurnitureSizeConfig, UserSelections } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SizeSelectorProps {
  sizes: FurnitureSizeConfig[];
  currentSelection: UserSelections['sizeId'];
  onSizeSelect: (sizeId: string) => void;
  onGetEstimate: () => void;
  onBack: () => void;
  categoryName: string;
}

export default function SizeSelector({ sizes, currentSelection, onSizeSelect, onGetEstimate, onBack, categoryName }: SizeSelectorProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Select Size for Your {categoryName}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">Choose the appropriate size or dimensions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="space-y-3 p-4 border rounded-lg shadow-sm bg-background">
          <Label htmlFor="size-selection" className="text-lg font-medium text-foreground">Available Sizes</Label>
          <RadioGroup
            id="size-selection"
            value={currentSelection || ''}
            onValueChange={onSizeSelect}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
          >
            {sizes.map((size) => (
              <Label
                key={size.id}
                htmlFor={`size-${size.id}`}
                className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary"
              >
                <RadioGroupItem value={size.id} id={`size-${size.id}`} />
                <span>{size.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>Back to Features</Button>
          <Button onClick={onGetEstimate} disabled={!currentSelection}>
            Get Price Estimate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
