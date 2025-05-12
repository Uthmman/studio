"use client";

import type { FurnitureCategory } from '@/lib/definitions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';

interface CategorySelectorProps {
  categories: FurnitureCategory[];
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySelector({ categories, onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Select a Furniture Category</h2>
        <p className="text-muted-foreground mt-2">Choose the type of furniture you're interested in.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = (LucideIcons as any)[category.iconName] || LucideIcons.HelpCircle;
          return (
            <Card 
              key={category.id} 
              onClick={() => onSelectCategory(category.id)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out hover:border-primary"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCategory(category.id)}
              aria-label={`Select category ${category.name}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-foreground">{category.name}</CardTitle>
                <IconComponent className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={category.imagePlaceholder}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={category.imageAiHint}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Click to select {category.name.toLowerCase()} and see options.</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
