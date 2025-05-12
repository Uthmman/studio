import type { LucideIcon } from 'lucide-react';

export interface PriceRange {
  min: number;
  max: number;
}

export interface FurnitureFeatureOption {
  id: string;
  label: string;
  iconName?: string; // Optional: Lucide icon name
  imagePlaceholder?: string; // Optional: URL for a placeholder image
  imageAiHint?: string; // Optional: AI hint for the image
}

export interface FurnitureFeatureConfig {
  id: string; 
  name: string; 
  options: FurnitureFeatureOption[];
}

export interface FurnitureSizeConfig {
  id: string;
  label: string;
  iconName?: string; // Optional: Lucide icon name
  imagePlaceholder?: string; // Optional: URL for a placeholder image
  imageAiHint?: string; // Optional: AI hint for the image
}

export interface FurnitureCategory {
  id: string;
  name: string;
  iconName: string; 
  features: FurnitureFeatureConfig[];
  sizes: FurnitureSizeConfig[];
  imagePlaceholder: string;
  imageAiHint: string;
}

export interface PriceDataEntry {
  categoryId: string;
  featureSelections: Record<string, string>; // { featureId: optionId }
  sizeId: string;
  priceRange: PriceRange;
}

export type UserSelections = {
  categoryId: string | null;
  featureSelections: Record<string, string>;
  sizeId: string | null;
};

export type Step = 'category' | 'features' | 'size' | 'result';
