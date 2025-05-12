import type { FurnitureCategory, PriceDataEntry } from '@/lib/definitions';

export const FURNITURE_CATEGORIES: FurnitureCategory[] = [
  {
    id: 'sofas',
    name: 'Sofas',
    iconName: 'Sofa',
    imagePlaceholder: 'https://picsum.photos/400/300',
    imageAiHint: 'living room sofa',
    features: [
      {
        id: 'seats',
        name: 'Number of Seats',
        options: [
          { id: '2-seater', label: '2-Seater' },
          { id: '3-seater', label: '3-Seater' },
          { id: 'sectional', label: 'Sectional' },
        ],
      },
      {
        id: 'material',
        name: 'Upholstery Material',
        options: [
          { id: 'fabric', label: 'Fabric' },
          { id: 'leather', label: 'Leather' },
          { id: 'velvet', label: 'Velvet' },
        ],
      },
      {
        id: 'style',
        name: 'Style',
        options: [
          { id: 'modern', label: 'Modern' },
          { id: 'traditional', label: 'Traditional' },
          { id: 'mid-century', label: 'Mid-Century' },
        ],
      },
    ],
    sizes: [
      { id: 'small', label: 'Small (50-69 inches)' },
      { id: 'medium', label: 'Medium (70-85 inches)' },
      { id: 'large', label: 'Large (86+ inches)' },
    ],
  },
  {
    id: 'tables',
    name: 'Dining Tables',
    iconName: 'Table2',
    imagePlaceholder: 'https://picsum.photos/400/300',
    imageAiHint: 'dining table',
    features: [
      {
        id: 'shape',
        name: 'Shape',
        options: [
          { id: 'rectangular', label: 'Rectangular' },
          { id: 'round', label: 'Round' },
          { id: 'square', label: 'Square' },
        ],
      },
      {
        id: 'material',
        name: 'Table Material',
        options: [
          { id: 'wood', label: 'Wood' },
          { id: 'glass', label: 'Glass' },
          { id: 'metal', label: 'Metal' },
        ],
      },
    ],
    sizes: [
      { id: '2-4-person', label: '2-4 Person' },
      { id: '4-6-person', label: '4-6 Person' },
      { id: '6-8-person', label: '6-8 Person' },
    ],
  },
  {
    id: 'beds',
    name: 'Beds',
    iconName: 'BedDouble',
    imagePlaceholder: 'https://picsum.photos/400/300',
    imageAiHint: 'bedroom bed',
    features: [
      {
        id: 'frameMaterial',
        name: 'Frame Material',
        options: [
          { id: 'wood', label: 'Wood' },
          { id: 'metal', label: 'Metal' },
          { id: 'upholstered', label: 'Upholstered' },
        ],
      },
      {
        id: 'headboard',
        name: 'Headboard',
        options: [
          { id: 'yes', label: 'With Headboard' },
          { id: 'no', label: 'Without Headboard' },
        ],
      },
    ],
    sizes: [
      { id: 'twin', label: 'Twin' },
      { id: 'full', label: 'Full' },
      { id: 'queen', label: 'Queen' },
      { id: 'king', label: 'King' },
    ],
  },
];

export const PRICE_DATA: PriceDataEntry[] = [
  // Sofas
  { categoryId: 'sofas', featureSelections: { seats: '2-seater', material: 'fabric', style: 'modern' }, sizeId: 'small', priceRange: { min: 300, max: 700 } },
  { categoryId: 'sofas', featureSelections: { seats: '3-seater', material: 'fabric', style: 'modern' }, sizeId: 'medium', priceRange: { min: 700, max: 1600 } },
  { categoryId: 'sofas', featureSelections: { seats: 'sectional', material: 'leather', style: 'traditional' }, sizeId: 'large', priceRange: { min: 1500, max: 3500 } },
  { categoryId: 'sofas', featureSelections: { seats: '2-seater', material: 'velvet', style: 'mid-century' }, sizeId: 'small', priceRange: { min: 500, max: 1000 } },
  { categoryId: 'sofas', featureSelections: { seats: '3-seater', material: 'leather', style: 'modern' }, sizeId: 'medium', priceRange: { min: 1200, max: 2500 } },

  // Dining Tables
  { categoryId: 'tables', featureSelections: { shape: 'rectangular', material: 'wood' }, sizeId: '4-6-person', priceRange: { min: 350, max: 850 } },
  { categoryId: 'tables', featureSelections: { shape: 'round', material: 'glass' }, sizeId: '2-4-person', priceRange: { min: 200, max: 600 } },
  { categoryId: 'tables', featureSelections: { shape: 'square', material: 'metal' }, sizeId: '6-8-person', priceRange: { min: 500, max: 1200 } },

  // Beds
  { categoryId: 'beds', featureSelections: { frameMaterial: 'wood', headboard: 'yes' }, sizeId: 'queen', priceRange: { min: 400, max: 1000 } },
  { categoryId: 'beds', featureSelections: { frameMaterial: 'metal', headboard: 'no' }, sizeId: 'king', priceRange: { min: 300, max: 800 } },
  { categoryId: 'beds', featureSelections: { frameMaterial: 'upholstered', headboard: 'yes' }, sizeId: 'full', priceRange: { min: 500, max: 1200 } },
  // Add more combinations as needed
];

export function getEstimatedPrice(
  categoryId: string | null,
  featureSelections: Record<string, string>,
  sizeId: string | null
): PriceDataEntry | null {
  if (!categoryId || !sizeId) return null;

  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const entry = PRICE_DATA.find(item => {
    if (item.categoryId !== categoryId || item.sizeId !== sizeId) {
      return false;
    }
    
    // For categories with features, check if all selected features match
    if (category.features.length > 0) {
      for (const feature of category.features) {
        if (item.featureSelections[feature.id] !== featureSelections[feature.id]) {
          return false;
        }
      }
    }
    // If a category has no features, it implies featureSelections might be empty or not considered in PRICE_DATA for that category.
    // This logic assumes that if a category has features, PRICE_DATA entries for it will also have corresponding featureSelections.
    // If a category has no features, featureSelections from PRICE_DATA for that category should ideally be empty or a specific marker.
    // For simplicity, we assume PRICE_DATA structure aligns with features defined in FURNITURE_CATEGORIES.
    
    return true;
  });
  return entry || null;
}

export function generateItemDescription(
  selections: UserSelections,
  categories: FurnitureCategory[]
): string {
  if (!selections.categoryId) return "No item selected";

  const category = categories.find(c => c.id === selections.categoryId);
  if (!category) return "Unknown category";

  let description = category.name;
  const featureParts: string[] = [];

  for (const featureConfig of category.features) {
    const selectedOptionId = selections.featureSelections[featureConfig.id];
    if (selectedOptionId) {
      const option = featureConfig.options.find(o => o.id === selectedOptionId);
      if (option) {
        featureParts.push(option.label);
      }
    }
  }
  if (featureParts.length > 0) {
    description += ` (${featureParts.join(', ')})`;
  }

  if (selections.sizeId) {
    const size = category.sizes.find(s => s.id === selections.sizeId);
    if (size) {
      description += `, Size: ${size.label}`;
    }
  }
  
  return description;
}
