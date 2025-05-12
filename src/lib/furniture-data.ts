import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig, UserSelections } from '@/lib/definitions';
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
          { id: 'sofas-feat-seats-opt-2', label: '2-Seater', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/sofa2seater/400/300', imageAiHint: 'small sofa' },
          { id: 'sofas-feat-seats-opt-3', label: '3-Seater', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/sofa3seater/400/300', imageAiHint: 'medium sofa' },
          { id: 'sofas-feat-seats-opt-sectional', label: 'Sectional', iconName: 'GalleryVerticalEnd', imagePlaceholder: 'https://picsum.photos/seed/sofasectional/400/300', imageAiHint: 'large sofa' },
        ],
      },
      {
        id: 'sofas-feat-material',
        name: 'Upholstery Material',
        options: [
          { id: 'sofas-feat-material-opt-fabric', label: 'Fabric', iconName: 'GalleryThumbnails', imagePlaceholder: 'https://picsum.photos/seed/fabrictex/100/100', imageAiHint: 'fabric texture' },
          { id: 'sofas-feat-material-opt-leather', label: 'Leather', iconName: 'Option', imagePlaceholder: 'https://picsum.photos/seed/leathertex/100/100', imageAiHint: 'leather texture' },
          { id: 'sofas-feat-material-opt-velvet', label: 'Velvet', iconName: 'Sparkles', imagePlaceholder: 'https://picsum.photos/seed/velvettes/100/100', imageAiHint: 'velvet texture' },
        ],
      },
      {
        id: 'sofas-feat-style',
        name: 'Style',
        options: [
          { id: 'sofas-feat-style-opt-modern', label: 'Modern', iconName: 'Zap', imagePlaceholder: 'https://picsum.photos/seed/modernsofa/400/300', imageAiHint: 'modern sofa' },
          { id: 'sofas-feat-style-opt-traditional', label: 'Traditional', iconName: 'Grape', imagePlaceholder: 'https://picsum.photos/seed/tradsofa/400/300', imageAiHint: 'classic sofa' },
          { id: 'sofas-feat-style-opt-midcentury', label: 'Mid-Century', iconName: 'Sun', imagePlaceholder: 'https://picsum.photos/seed/midcenturysofa/400/300', imageAiHint: 'retro sofa' },
        ],
      },
    ],
    sizes: [
      { id: 'sofas-size-small', label: 'Small (50-69 inches)', iconName: 'Minimize2', imagePlaceholder: 'https://picsum.photos/seed/smallfurniture/80/60', imageAiHint: 'compact furniture' },
      { id: 'sofas-size-medium', label: 'Medium (70-85 inches)', iconName: 'AppWindow', imagePlaceholder: 'https://picsum.photos/seed/mediumfurniture/100/75', imageAiHint: 'standard furniture' },
      { id: 'sofas-size-large', label: 'Large (86+ inches)', iconName: 'Maximize2', imagePlaceholder: 'https://picsum.photos/seed/largefurniture/120/90', imageAiHint: 'spacious furniture' },
    ],
  },
  {
    id: 'tables',
    name: 'Dining Tables',
    iconName: 'Table2',
    imagePlaceholder: 'https://picsum.photos/seed/diningtablemain/400/300',
    imageAiHint: 'dining table',
    features: [
      {
        id: 'tables-feat-shape',
        name: 'Shape',
        options: [
          { id: 'tables-feat-shape-opt-rect', label: 'Rectangular', iconName: 'RectangleHorizontal', imagePlaceholder: 'https://picsum.photos/seed/recttable/400/300', imageAiHint: 'rectangle table' },
          { id: 'tables-feat-shape-opt-round', label: 'Round', iconName: 'Circle', imagePlaceholder: 'https://picsum.photos/seed/roundtable/400/300', imageAiHint: 'round table' },
          { id: 'tables-feat-shape-opt-square', label: 'Square', iconName: 'Square', imagePlaceholder: 'https://picsum.photos/seed/squaretable/400/300', imageAiHint: 'square table' },
        ],
      },
      {
        id: 'tables-feat-material',
        name: 'Table Material',
        options: [
          { id: 'tables-feat-material-opt-wood', label: 'Wood', iconName: 'TreeDeciduous', imagePlaceholder: 'https://picsum.photos/seed/woodgrain/100/100', imageAiHint: 'wood grain' },
          { id: 'tables-feat-material-opt-glass', label: 'Glass', iconName: 'MinusSquare', imagePlaceholder: 'https://picsum.photos/seed/glasssurface/100/100', imageAiHint: 'glass surface' }, 
          { id: 'tables-feat-material-opt-metal', label: 'Metal', iconName: 'Settings2', imagePlaceholder: 'https://picsum.photos/seed/metalsurface/100/100', imageAiHint: 'metal surface' },
        ],
      },
    ],
    sizes: [
      { id: 'tables-size-2-4', label: '2-4 Person', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/table24/400/300', imageAiHint: 'small dining' },
      { id: 'tables-size-4-6', label: '4-6 Person', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/table46/400/300', imageAiHint: 'medium dining' },
      { id: 'tables-size-6-8', label: '6-8 Person', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/table68/400/300', imageAiHint: 'large dining' },
    ],
  },
  {
    id: 'beds',
    name: 'Beds',
    iconName: 'BedDouble',
    imagePlaceholder: 'https://picsum.photos/seed/bedroombedmain/400/300',
    imageAiHint: 'bedroom bed',
    features: [
      {
        id: 'beds-feat-frame',
        name: 'Frame Material',
        options: [
          { id: 'beds-feat-frame-opt-wood', label: 'Wood', iconName: 'Construction', imagePlaceholder: 'https://picsum.photos/seed/woodframe/100/100', imageAiHint: 'wood frame' },
          { id: 'beds-feat-frame-opt-metal', label: 'Metal', iconName: 'Shield', imagePlaceholder: 'https://picsum.photos/seed/metalframe/100/100', imageAiHint: 'metal frame' }, 
          { id: 'beds-feat-frame-opt-upholstered', label: 'Upholstered', iconName: 'Pillow', imagePlaceholder: 'https://picsum.photos/seed/upholsteredframe/100/100', imageAiHint: 'fabric frame' },
        ],
      },
      {
        id: 'beds-feat-headboard',
        name: 'Headboard',
        options: [
          { id: 'beds-feat-headboard-opt-yes', label: 'With Headboard', iconName: 'SquareArrowUp', imagePlaceholder: 'https://picsum.photos/seed/bedheadboard/400/300', imageAiHint: 'bed headboard' },
          { id: 'beds-feat-headboard-opt-no', label: 'Without Headboard', iconName: 'MinusSquare', imagePlaceholder: 'https://picsum.photos/seed/simplebed/400/300', imageAiHint: 'simple bed' },
        ],
      },
    ],
    sizes: [
      { id: 'beds-size-twin', label: 'Twin', iconName: 'BedSingle', imagePlaceholder: 'https://picsum.photos/seed/twinbed/400/300', imageAiHint: 'single bed' },
      { id: 'beds-size-full', label: 'Full', iconName: 'Bed', imagePlaceholder: 'https://picsum.photos/seed/fullbed/400/300', imageAiHint: 'double bed' },
      { id: 'beds-size-queen', label: 'Queen', iconName: 'BedDouble', imagePlaceholder: 'https://picsum.photos/seed/queenbed/400/300', imageAiHint: 'queen size' },
      { id: 'beds-size-king', label: 'King', iconName: 'BedDouble', imagePlaceholder: 'https://picsum.photos/seed/kingbed/400/300', imageAiHint: 'king size' },
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
      const newOption: FurnitureFeatureOption = { 
        ...optionData,
        id: generateId(`${featureId}-opt`),
        iconName: optionData.iconName || '', 
        imagePlaceholder: optionData.imagePlaceholder || `https://picsum.photos/seed/${generateId('img')}/50/50`, 
        imageAiHint: optionData.imageAiHint || '', 
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
            ...feature.options[optionIndex], 
            ...updatedOption, 
            imagePlaceholder: updatedOption.imagePlaceholder || `https://picsum.photos/seed/${generateId('img')}/50/50`,
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
      PRICE_DATA.forEach(p => {
        if (p.categoryId === categoryId && p.featureSelections[featureId] === optionId) {
          delete p.featureSelections[featureId]; 
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
    const newSize: FurnitureSizeConfig = { 
      ...sizeData,
      id: generateId(`${categoryId}-size`),
      iconName: sizeData.iconName || '', 
      imagePlaceholder: sizeData.imagePlaceholder || `https://picsum.photos/seed/${generateId('img')}/80/80`, 
      imageAiHint: sizeData.imageAiHint || '', 
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
          imagePlaceholder: updatedSize.imagePlaceholder || `https://picsum.photos/seed/${generateId('img')}/80/80`,
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
    PRICE_DATA = PRICE_DATA.filter(p => !(p.categoryId === categoryId && p.sizeId === sizeId));
    return category.sizes.length < initialLength;
  }
  return false;
};


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
    
    // Check features only if the category has features defined
    if (category.features.length > 0) {
      // All features selected by the user for this category must match the price entry's features
      for (const feature of category.features) {
        const userSelectedOptionId = featureSelections[feature.id];
        const priceEntryOptionId = item.featureSelections[feature.id];

        // If the price entry specifies this feature, it must match the user's selection (or user didn't select this specific feature)
        if (priceEntryOptionId !== undefined && userSelectedOptionId !== priceEntryOptionId) {
          return false;
        }
        // If user selected an option for a feature, but price entry doesn't specify it, this price entry is not specific enough.
        // However, many price entries might not list all features if they are "base" prices.
        // This logic implies price entries must be fully specified if features are involved.
        // A simpler check: only compare features present in item.featureSelections
      }
       for (const featureIdInPriceEntry in item.featureSelections) {
         if (featureSelections[featureIdInPriceEntry] !== item.featureSelections[featureIdInPriceEntry]) {
           return false;
         }
       }

    }
    
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

export function getFinalImageForSelections(
  selections: UserSelections,
  allCategories: FurnitureCategory[]
): { finalImageUrl: string | null; finalImageAiHint: string | null } {
  if (!selections.categoryId) return { finalImageUrl: null, finalImageAiHint: null };

  const category = allCategories.find(c => c.id === selections.categoryId);
  if (!category) return { finalImageUrl: category?.imagePlaceholder || null, finalImageAiHint: category?.imageAiHint || null };

  let finalImageUrl = category.imagePlaceholder;
  let finalImageAiHint = category.imageAiHint;

  // Prioritize size image if available
  if (selections.sizeId) {
    const sizeConfig = category.sizes.find(s => s.id === selections.sizeId);
    if (sizeConfig?.imagePlaceholder) {
      finalImageUrl = sizeConfig.imagePlaceholder;
      finalImageAiHint = sizeConfig.imageAiHint || sizeConfig.label;
    }
  }
  
  // Then, check feature options. Last selected feature with an image might override.
  // This logic can be adjusted based on which image is most representative.
  // For simplicity, let's say a distinct feature option image (if any) takes precedence over size or category image.
  // This might require a specific feature to be designated as primary for visuals.
  // Current logic: category -> size (if image) -> specific feature option (if image, potentially last one iterated)

  // Let's try to find the most "specific" image.
  // If a feature option has a distinct image, it might be preferred.
  // For this example, let's pick the image from the *first* feature that has a selected option with an image.
  // This is arbitrary and can be refined.
  for (const feature of category.features) {
    const selectedOptionId = selections.featureSelections[feature.id];
    if (selectedOptionId) {
      const option = feature.options.find(opt => opt.id === selectedOptionId);
      if (option?.imagePlaceholder) {
        finalImageUrl = option.imagePlaceholder; // This will be the image of the first feature option with an image
        finalImageAiHint = option.imageAiHint || option.label;
        break; // Found a feature image, use it and stop.
      }
    }
  }
  // If no feature option image was found, and size image was not set, it defaults to category image.
  // If size image WAS set, and no feature image found, it remains the size image.

  return { finalImageUrl, finalImageAiHint };
}
