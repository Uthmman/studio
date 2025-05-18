import type { LucideIcon } from 'lucide-react';

export interface PriceRange {
  min: number;
  max: number;
}

export interface FurnitureFeatureOption {
  id: string;
  label: string;
  iconName?: string; // Optional: Lucide icon name
  imagePlaceholder?: string; // Optional: URL for a placeholder image or Data URI
  imageAiHint?: string; // Optional: AI hint for the image
}

export interface FurnitureFeatureConfig {
  id: string; 
  name: string; 
  options: FurnitureFeatureOption[];
  selectionType?: 'single' | 'multiple'; // New: Defaults to 'single'
}

export interface FurnitureSizeConfig {
  id: string;
  label: string;
  iconName?: string; // Optional: Lucide icon name
  imagePlaceholder?: string; // Optional: URL for a placeholder image or Data URI
  imageAiHint?: string; // Optional: AI hint for the image
}

export interface FurnitureCategory {
  id: string;
  name: string;
  iconName: string; 
  features: FurnitureFeatureConfig[];
  sizes: FurnitureSizeConfig[];
  imagePlaceholder: string; // Can be a URL or a Data URI
  imageAiHint: string;
}

export interface PriceDataEntry {
  categoryId: string;
  featureSelections: Record<string, string | string[]>; // { featureId: optionId or optionId[] }
  sizeId: string;
  priceRange: PriceRange;
}

export type UserSelections = {
  categoryId: string | null;
  featureSelections: Record<string, string | string[]>; // Updated for multi-select
  sizeId: string | null;
};

export type Step = 'category' | 'features' | 'size' | 'result';

export interface EstimationRecord {
  id: string; // Unique ID for the record
  selections: UserSelections; // The selections that led to this estimate
  description: string; // Generated item description
  priceRange: PriceRange | null; // The estimated price
  timestamp: number; // Timestamp of when the record was created/saved
  name?: string; // Optional user-defined name for saved estimates
}

// For displaying price entries in the admin panel, including combinations that might not have a price yet.
export interface DisplayablePriceEntry extends Omit<PriceDataEntry, 'featureSelections'> {
  featureSelections: Record<string, string | string[]>; 
  description: string; 
  isPriced: boolean; 
  categoryName: string; 
  featureDescription: string; 
  sizeLabel: string; 
  imageUrl: string; // URL or Data URI for the representative image of the combination
  imageAiHint: string; // AI hint for the representative image
}
