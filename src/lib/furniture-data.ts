import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig } from '@/lib/definitions';
import { generateId } from '@/lib/utils';

// Make data mutable for in-session admin editing
export let FURNITURE_CATEGORIES: FurnitureCategory[] = [
  {
    id: 'sofas',
    name: 'Sofas',
    iconName: 'Sofa',
    imagePlaceholder: 'https://picsum.photos/400/300',
    imageAiHint: 'living room sofa',
    features: [
      {
        id: 'sofas-feat-seats',
        name: 'Number of Seats',
        options: [
          { id: 'sofas-feat-seats-opt-2', label: '2-Seater', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/100/80', imageAiHint: 'small sofa' },
          { id: 'sofas-feat-seats-opt-3', label: '3-Seater', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/120/90', imageAiHint: 'medium sofa' },
          { id: 'sofas-feat-seats-opt-sectional', label: 'Sectional', iconName: 'GalleryVerticalEnd', imagePlaceholder: 'https://picsum.photos/150/100', imageAiHint: 'large sofa' },
        ],
      },
      {
        id: 'sofas-feat-material',
        name: 'Upholstery Material',
        options: [
          { id: 'sofas-feat-material-opt-fabric', label: 'Fabric', iconName: 'GalleryThumbnails', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'fabric texture' },
          { id: 'sofas-feat-material-opt-leather', label: 'Leather', iconName: 'Option', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'leather texture' },
          { id: 'sofas-feat-material-opt-velvet', label: 'Velvet', iconName: 'Sparkles', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'velvet texture' },
        ],
      },
      {
        id: 'sofas-feat-style',
        name: 'Style',
        options: [
          { id: 'sofas-feat-style-opt-modern', label: 'Modern', iconName: 'Zap', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'modern design' },
          { id: 'sofas-feat-style-opt-traditional', label: 'Traditional', iconName: 'Grape', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'classic design' },
          { id: 'sofas-feat-style-opt-midcentury', label: 'Mid-Century', iconName: 'Sun', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'retro design' },
        ],
      },
    ],
    sizes: [
      { id: 'sofas-size-small', label: 'Small (50-69 inches)', iconName: 'Minimize2', imagePlaceholder: 'https://picsum.photos/80/60', imageAiHint: 'compact furniture' },
      { id: 'sofas-size-medium', label: 'Medium (70-85 inches)', iconName: 'AppWindow', imagePlaceholder: 'https://picsum.photos/100/75', imageAiHint: 'standard furniture' },
      { id: 'sofas-size-large', label: 'Large (86+ inches)', iconName: 'Maximize2', imagePlaceholder: 'https://picsum.photos/120/90', imageAiHint: 'spacious furniture' },
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
        id: 'tables-feat-shape',
        name: 'Shape',
        options: [
          { id: 'tables-feat-shape-opt-rect', label: 'Rectangular', iconName: 'RectangleHorizontal', imagePlaceholder: 'https://picsum.photos/100/70', imageAiHint: 'rectangle table' },
          { id: 'tables-feat-shape-opt-round', label: 'Round', iconName: 'Circle', imagePlaceholder: 'https://picsum.photos/90/90', imageAiHint: 'round table' },
          { id: 'tables-feat-shape-opt-square', label: 'Square', iconName: 'Square', imagePlaceholder: 'https://picsum.photos/80/80', imageAiHint: 'square table' },
        ],
      },
      {
        id: 'tables-feat-material',
        name: 'Table Material',
        options: [
          { id: 'tables-feat-material-opt-wood', label: 'Wood', iconName: 'TreeDeciduous', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'wood grain' },
          { id: 'tables-feat-material-opt-glass', label: 'Glass', iconName: 'MinusSquare', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'glass surface' }, // Placeholder icon, MinusSquare is not ideal
          { id: 'tables-feat-material-opt-metal', label: 'Metal', iconName: 'Settings2', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'metal surface' }, // Placeholder icon
        ],
      },
    ],
    sizes: [
      { id: 'tables-size-2-4', label: '2-4 Person', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/80/60', imageAiHint: 'small group' },
      { id: 'tables-size-4-6', label: '4-6 Person', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/100/75', imageAiHint: 'medium group' },
      { id: 'tables-size-6-8', label: '6-8 Person', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/120/90', imageAiHint: 'large group' },
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
        id: 'beds-feat-frame',
        name: 'Frame Material',
        options: [
          { id: 'beds-feat-frame-opt-wood', label: 'Wood', iconName: 'Construction', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'wood frame' },
          { id: 'beds-feat-frame-opt-metal', label: 'Metal', iconName: 'Shield', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'metal frame' }, // Placeholder icon
          { id: 'beds-feat-frame-opt-upholstered', label: 'Upholstered', iconName: 'Pillow', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'fabric frame' },
        ],
      },
      {
        id: 'beds-feat-headboard',
        name: 'Headboard',
        options: [
          { id: 'beds-feat-headboard-opt-yes', label: 'With Headboard', iconName: 'SquareArrowUp', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'bed headboard' },
          { id: 'beds-feat-headboard-opt-no', label: 'Without Headboard', iconName: 'MinusSquare', imagePlaceholder: 'https://picsum.photos/100/100', imageAiHint: 'simple bed' },
        ],
      },
    ],
    sizes: [
      { id: 'beds-size-twin', label: 'Twin', iconName: 'BedSingle', imagePlaceholder: 'https://picsum.photos/80/120', imageAiHint: 'single bed' },
      { id: 'beds-size-full', label: 'Full', iconName: 'Bed', imagePlaceholder: 'https://picsum.photos/100/120', imageAiHint: 'double bed' },
      { id: 'beds-size-queen', label: 'Queen', iconName: 'BedDouble', imagePlaceholder: 'https://picsum.photos/120/120', imageAiHint: 'queen size' },
      { id: 'beds-size-king', label: 'King', iconName: 'BedDouble', imagePlaceholder: 'https://picsum.photos/140/120', imageAiHint: 'king size' }, // Using BedDouble, might need more distinct icons
    ],
  },
];

export let PRICE_DATA: PriceDataEntry[] = [
  // Sofas
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-small', priceRange: { min: 300, max: 700 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-3', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-medium', priceRange: { min: 700, max: 1600 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-sectional', 'sofas-feat-material': 'sofas-feat-material-opt-leather', 'sofas-feat-style': 'sofas-feat-style-opt-traditional' }, sizeId: 'sofas-size-large', priceRange: { min: 1500, max: 3500 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-velvet', 'sofas-feat-style': 'sofas-feat-style-opt-midcentury' }, sizeId: 'sofas-size-small', priceRange: { min: 500, max: 1000 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-3', 'sofas-feat-material': 'sofas-feat-material-opt-leather', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-medium', priceRange: { min: 1200, max: 2500 } },

  // Dining Tables
  { categoryId: 'tables', featureSelections: { 'tables-feat-shape': 'tables-feat-shape-opt-rect', 'tables-feat-material': 'tables-feat-material-opt-wood' }, sizeId: 'tables-size-4-6', priceRange: { min: 350, max: 850 } },
  { categoryId: 'tables', featureSelections: { 'tables-feat-shape': 'tables-feat-shape-opt-round', 'tables-feat-material': 'tables-feat-material-opt-glass' }, sizeId: 'tables-size-2-4', priceRange: { min: 200, max: 600 } },
  { categoryId: 'tables', featureSelections: { 'tables-feat-shape': 'tables-feat-shape-opt-square', 'tables-feat-material': 'tables-feat-material-opt-metal' }, sizeId: 'tables-size-6-8', priceRange: { min: 500, max: 1200 } },

  // Beds
  { categoryId: 'beds', featureSelections: { 'beds-feat-frame': 'beds-feat-frame-opt-wood', 'beds-feat-headboard': 'beds-feat-headboard-opt-yes' }, sizeId: 'beds-size-queen', priceRange: { min: 400, max: 1000 } },
  { categoryId: 'beds', featureSelections: { 'beds-feat-frame': 'beds-feat-frame-opt-metal', 'beds-feat-headboard': 'beds-feat-headboard-opt-no' }, sizeId: 'beds-size-king', priceRange: { min: 300, max: 800 } },
  { categoryId: 'beds', featureSelections: { 'beds-feat-frame': 'beds-feat-frame-opt-upholstered', 'beds-feat-headboard': 'beds-feat-headboard-opt-yes' }, sizeId: 'beds-size-full', priceRange: { min: 500, max: 1200 } },
];

// Category CRUD
export const addCategory = (categoryData: Omit<FurnitureCategory, 'id' | 'features' | 'sizes'>): FurnitureCategory => {
  const newCategory: FurnitureCategory = {
    ...categoryData,
    id: generateId('cat'),
    features: [],
    sizes: [],
  };
  FURNITURE_CATEGORIES.push(newCategory);
  return newCategory;
};

export const updateCategory = (updatedCategory: FurnitureCategory): FurnitureCategory | null => {
  const index = FURNITURE_CATEGORIES.findIndex(c => c.id === updatedCategory.id);
  if (index !== -1) {
    FURNITURE_CATEGORIES[index] = updatedCategory;
    return updatedCategory;
  }
  return null;
};

export const deleteCategory = (categoryId: string): boolean => {
  const initialLength = FURNITURE_CATEGORIES.length;
  FURNITURE_CATEGORIES = FURNITURE_CATEGORIES.filter(c => c.id !== categoryId);
  // Also remove related price data
  PRICE_DATA = PRICE_DATA.filter(p => p.categoryId !== categoryId);
  return FURNITURE_CATEGORIES.length < initialLength;
};

// Feature CRUD
export const addFeatureToCategory = (categoryId: string, featureData: Omit<FurnitureFeatureConfig, 'id' | 'options'>): FurnitureFeatureConfig | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const newFeature: FurnitureFeatureConfig = {
      ...featureData,
      id: generateId(`${categoryId}-feat`),
      options: [],
    };
    category.features.push(newFeature);
    return newFeature;
  }
  return null;
};

export const updateFeatureInCategory = (categoryId: string, updatedFeature: FurnitureFeatureConfig): FurnitureFeatureConfig | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const featureIndex = category.features.findIndex(f => f.id === updatedFeature.id);
    if (featureIndex !== -1) {
      category.features[featureIndex] = updatedFeature;
      return updatedFeature;
    }
  }
  return null;
};

export const deleteFeatureFromCategory = (categoryId: string, featureId: string): boolean => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const initialLength = category.features.length;
    category.features = category.features.filter(f => f.id !== featureId);
    // Also remove related feature selections from price data
    PRICE_DATA.forEach(p => {
      if (p.categoryId === categoryId && p.featureSelections[featureId]) {
        delete p.featureSelections[featureId];
      }
    });
    return category.features.length < initialLength;
  }
  return false;
};

// Feature Option CRUD
export const addOptionToFeature = (categoryId: string, featureId: string, optionData: Omit<FurnitureFeatureOption, 'id'>): FurnitureFeatureOption | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const feature = category.features.find(f => f.id === featureId);
    if (feature) {
      const newOption: FurnitureFeatureOption = { // Ensure all fields are initialized
        ...optionData,
        id: generateId(`${featureId}-opt`),
        iconName: optionData.iconName || '', // provide default
        imagePlaceholder: optionData.imagePlaceholder || 'https://picsum.photos/50/50', // provide default
        imageAiHint: optionData.imageAiHint || '', // provide default
      };
      feature.options.push(newOption);
      return newOption;
    }
  }
  return null;
};

export const updateOptionInFeature = (categoryId: string, featureId: string, updatedOption: FurnitureFeatureOption): FurnitureFeatureOption | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const feature = category.features.find(f => f.id === featureId);
    if (feature) {
      const optionIndex = feature.options.findIndex(o => o.id === updatedOption.id);
      if (optionIndex !== -1) {
        feature.options[optionIndex] = {
            ...feature.options[optionIndex], // preserve existing fields
            ...updatedOption, // overwrite with new data
            imagePlaceholder: updatedOption.imagePlaceholder || 'https://picsum.photos/50/50',
            imageAiHint: updatedOption.imageAiHint || updatedOption.label.toLowerCase(),
        };
        return feature.options[optionIndex];
      }
    }
  }
  return null;
};

export const deleteOptionFromFeature = (categoryId: string, featureId: string, optionId: string): boolean => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const feature = category.features.find(f => f.id === featureId);
    if (feature) {
      const initialLength = feature.options.length;
      feature.options = feature.options.filter(o => o.id !== optionId);
       // Also remove related option from price data feature selections
      PRICE_DATA.forEach(p => {
        if (p.categoryId === categoryId && p.featureSelections[featureId] === optionId) {
          delete p.featureSelections[featureId]; // Or set to a default/null if applicable
        }
      });
      return feature.options.length < initialLength;
    }
  }
  return false;
};


// Size CRUD
export const addSizeToCategory = (categoryId: string, sizeData: Omit<FurnitureSizeConfig, 'id'>): FurnitureSizeConfig | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const newSize: FurnitureSizeConfig = { // Ensure all fields are initialized
      ...sizeData,
      id: generateId(`${categoryId}-size`),
      iconName: sizeData.iconName || '', // provide default
      imagePlaceholder: sizeData.imagePlaceholder || 'https://picsum.photos/80/80', // provide default
      imageAiHint: sizeData.imageAiHint || '', // provide default
    };
    category.sizes.push(newSize);
    return newSize;
  }
  return null;
};

export const updateSizeInCategory = (categoryId: string, updatedSize: FurnitureSizeConfig): FurnitureSizeConfig | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const sizeIndex = category.sizes.findIndex(s => s.id === updatedSize.id);
    if (sizeIndex !== -1) {
      category.sizes[sizeIndex] = {
          ...category.sizes[sizeIndex],
          ...updatedSize,
          imagePlaceholder: updatedSize.imagePlaceholder || 'https://picsum.photos/80/80',
          imageAiHint: updatedSize.imageAiHint || updatedSize.label.toLowerCase(),
      };
      return category.sizes[sizeIndex];
    }
  }
  return null;
};

export const deleteSizeFromCategory = (categoryId: string, sizeId: string): boolean => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const initialLength = category.sizes.length;
    category.sizes = category.sizes.filter(s => s.id !== sizeId);
    // Also remove related price data entries
    PRICE_DATA = PRICE_DATA.filter(p => !(p.categoryId === categoryId && p.sizeId === sizeId));
    return category.sizes.length < initialLength;
  }
  return false;
};


// Price Data (Simplified - focusing on category deletion impact)
// More complex Price Data CRUD would involve matching features etc.

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
    
    if (category.features.length > 0) {
      for (const feature of category.features) {
        // If a feature defined in the category is not in item.featureSelections, it's not a match
        // unless featureSelections for that feature is also undefined (meaning this feature combination wasn't specified)
        // This logic might need refinement based on how partial feature matches are handled for pricing.
        // For exact match:
        if (featureSelections[feature.id] !== undefined && item.featureSelections[feature.id] !== featureSelections[feature.id]) {
          return false;
        }
         // If item.featureSelections has a specific value for a feature, but user's selections don't, it might still be a match depending on pricing rules
         // For now, let's assume if a feature is in item.featureSelections, it must match or be absent in user selections.
        if (item.featureSelections[feature.id] !== undefined && featureSelections[feature.id] === undefined) {
            // This case is tricky: if price data is specific about a feature, but user hasn't selected it.
            // For simplicity, let's require a match if item.featureSelections has it.
            // Or, if PRICE_DATA can have entries without all features, this needs adjustment.
            // A simpler model: if category.features has N features, PRICE_DATA has N featureSelections or fewer.
            // The current PRICE_DATA entries seem to imply all relevant features for that price point are listed.
        }
      }
      // Also check if user selections have features not in price entry (could mean a more specific item)
       for (const userFeatureId in featureSelections) {
           if (category.features.find(f => f.id === userFeatureId) && item.featureSelections[userFeatureId] === undefined && featureSelections[userFeatureId] !== undefined) {
               // User selected a feature that this price entry doesn't specify. Could be a mismatch or a more generic price entry.
               // For now, let's be strict: all selected features relevant to the category must match or be absent in the price data point.
           }
       }
    }
    
    return true;
  });
  return entry || null;
}

export function generateItemDescription(
  selections: UserSelections,
  categories: FurnitureCategory[] // Use the potentially modified categories
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
