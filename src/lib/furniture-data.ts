import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig, UserSelections, DisplayablePriceEntry } from '@/lib/definitions';
import { generateId } from '@/lib/utils';

// Helper to convert array of option IDs to a canonical string form (sorted, comma-separated)
// and to handle single string values consistently.
export const getCanonicalFeatureValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value.sort().join(',');
  }
  return value || ''; // Return empty string if undefined or already a string (could be empty)
};


// Make data mutable for in-session admin editing
export let FURNITURE_CATEGORIES: FurnitureCategory[] = [
  {
    id: 'sofas',
    name: 'Sofas',
    iconName: 'Sofa',
    imagePlaceholder: 'https://picsum.photos/seed/sofasmain/400/300',
    imageAiHint: 'living room sofa',
    features: [
      {
        id: 'sofas-feat-seats',
        name: 'Number of Seats',
        selectionType: 'single',
        options: [
          { id: 'sofas-feat-seats-opt-2', label: '2-Seater', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/sofa2seater/400/300', imageAiHint: 'small sofa' },
          { id: 'sofas-feat-seats-opt-3', label: '3-Seater', iconName: 'Users', imagePlaceholder: 'https://picsum.photos/seed/sofa3seater/400/300', imageAiHint: 'medium sofa' },
          { id: 'sofas-feat-seats-opt-sectional', label: 'Sectional', iconName: 'GalleryVerticalEnd', imagePlaceholder: 'https://picsum.photos/seed/sofasectional/400/300', imageAiHint: 'large sofa' },
        ],
      },
      {
        id: 'sofas-feat-material',
        name: 'Upholstery Material',
        selectionType: 'single',
        options: [
          { id: 'sofas-feat-material-opt-fabric', label: 'Fabric', iconName: 'GalleryThumbnails', imagePlaceholder: 'https://picsum.photos/seed/fabrictex/100/100', imageAiHint: 'fabric texture' },
          { id: 'sofas-feat-material-opt-leather', label: 'Leather', iconName: 'Option', imagePlaceholder: 'https://picsum.photos/seed/leathertex/100/100', imageAiHint: 'leather texture' },
          { id: 'sofas-feat-material-opt-velvet', label: 'Velvet', iconName: 'Sparkles', imagePlaceholder: 'https://picsum.photos/seed/velvettes/100/100', imageAiHint: 'velvet texture' },
        ],
      },
      {
        id: 'sofas-feat-style',
        name: 'Style',
        selectionType: 'multiple', // Changed to multiple for testing
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
        selectionType: 'single',
        options: [
          { id: 'tables-feat-shape-opt-rect', label: 'Rectangular', iconName: 'RectangleHorizontal', imagePlaceholder: 'https://picsum.photos/seed/recttable/400/300', imageAiHint: 'rectangle table' },
          { id: 'tables-feat-shape-opt-round', label: 'Round', iconName: 'Circle', imagePlaceholder: 'https://picsum.photos/seed/roundtable/400/300', imageAiHint: 'round table' },
          { id: 'tables-feat-shape-opt-square', label: 'Square', iconName: 'Square', imagePlaceholder: 'https://picsum.photos/seed/squaretable/400/300', imageAiHint: 'square table' },
        ],
      },
      {
        id: 'tables-feat-material',
        name: 'Table Material',
        selectionType: 'single',
        options: [
          { id: 'tables-feat-material-opt-wood', label: 'Wood', iconName: 'TreeDeciduous', imagePlaceholder: 'https://picsum.photos/seed/woodgrain/100/100', imageAiHint: 'wood grain' },
          { id: 'tables-feat-material-opt-glass', label: 'Glass', iconName: 'SquareDashedBottom', imagePlaceholder: 'https://picsum.photos/seed/glasssurface/100/100', imageAiHint: 'glass surface' }, 
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
        selectionType: 'single',
        options: [
          { id: 'beds-feat-frame-opt-wood', label: 'Wood', iconName: 'Construction', imagePlaceholder: 'https://picsum.photos/seed/woodframe/100/100', imageAiHint: 'wood frame' },
          { id: 'beds-feat-frame-opt-metal', label: 'Metal', iconName: 'Shield', imagePlaceholder: 'https://picsum.photos/seed/metalframe/100/100', imageAiHint: 'metal frame' }, 
          { id: 'beds-feat-frame-opt-upholstered', label: 'Upholstered', iconName: 'Pillow', imagePlaceholder: 'https://picsum.photos/seed/upholsteredframe/100/100', imageAiHint: 'fabric frame' },
        ],
      },
      {
        id: 'beds-feat-headboard',
        name: 'Headboard',
        selectionType: 'single',
        options: [
          { id: 'beds-feat-headboard-opt-yes', label: 'With Headboard', iconName: 'SquareArrowUp', imagePlaceholder: 'https://picsum.photos/seed/bedheadboard/400/300', imageAiHint: 'bed headboard' },
          { id: 'beds-feat-headboard-opt-no', label: 'Without Headboard', iconName: 'SquareDashedBottom', imagePlaceholder: 'https://picsum.photos/seed/simplebed/400/300', imageAiHint: 'simple bed' },
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
  // Sofas - Note: 'sofas-feat-style' is multi-select
  // Single style selections
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-small', priceRange: { min: 300, max: 700 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-3', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-medium', priceRange: { min: 700, max: 1600 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-sectional', 'sofas-feat-material': 'sofas-feat-material-opt-leather', 'sofas-feat-style': 'sofas-feat-style-opt-traditional' }, sizeId: 'sofas-size-large', priceRange: { min: 1500, max: 3500 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-velvet', 'sofas-feat-style': 'sofas-feat-style-opt-midcentury' }, sizeId: 'sofas-size-small', priceRange: { min: 500, max: 1000 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-3', 'sofas-feat-material': 'sofas-feat-material-opt-leather', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-medium', priceRange: { min: 1200, max: 2500 } },
  // Multi-style selection example (Modern + Mid-Century)
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': getCanonicalFeatureValue(['sofas-feat-style-opt-midcentury', 'sofas-feat-style-opt-modern']) }, sizeId: 'sofas-size-small', priceRange: { min: 600, max: 1100 } },
  
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
      selectionType: featureData.selectionType || 'single',
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
      category.features[featureIndex] = {
        ...updatedFeature,
        selectionType: updatedFeature.selectionType || 'single',
      };
      return category.features[featureIndex];
    }
  }
  return null;
};

export const deleteFeatureFromCategory = (categoryId: string, featureId: string): boolean => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (category) {
    const initialLength = category.features.length;
    category.features = category.features.filter(f => f.id !== featureId);
    PRICE_DATA = PRICE_DATA.filter(p => {
      if (p.categoryId !== categoryId) return true; // Keep if not this category
      // Check if the deleted feature was part of this price entry's selections
      const featureValue = p.featureSelections[featureId];
      if (featureValue === undefined) return true; // Keep if this feature wasn't selected
      return false; // Remove if this feature was selected
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
      // Remove price data entries that used this specific option
      PRICE_DATA = PRICE_DATA.filter(p => {
        if (p.categoryId !== categoryId) return true;
        const selectionForFeature = p.featureSelections[featureId];
        if (typeof selectionForFeature === 'string') {
          return selectionForFeature !== optionId;
        } else if (Array.isArray(selectionForFeature)) {
          return !selectionForFeature.includes(optionId);
        }
        return true;
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
  featureSelectionsFromUser: Record<string, string | string[]>,
  sizeId: string | null
): PriceDataEntry | null {
  if (!categoryId || !sizeId) return null;

  const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const entry = PRICE_DATA.find(item => {
    if (item.categoryId !== categoryId || item.sizeId !== sizeId) {
      return false;
    }

    // For categories with no features, direct match on categoryId and sizeId is enough if item.featureSelections is empty.
    if (category.features.length === 0) {
      return Object.keys(item.featureSelections).length === 0;
    }

    // Compare feature selections
    // Number of features being compared should match the category's defined features
    if (Object.keys(item.featureSelections).length !== category.features.length) {
        // This check might be too strict if price data can omit features (using defaults).
        // For now, assume price data is explicit for all category features.
        // console.warn("Price data feature count mismatch for category:", category.name, item.featureSelections, category.features);
        // return false; 
    }


    return category.features.every(featureConfig => {
      const userSelectionForFeature = featureSelectionsFromUser[featureConfig.id];
      const priceDataSelectionForFeature = item.featureSelections[featureConfig.id];
      
      // If a feature is defined for the category but not present in price data or user selection (should not happen with proper UI)
      if (userSelectionForFeature === undefined && priceDataSelectionForFeature === undefined) return true; // Both undefined, considered a match for this feature
      if (userSelectionForFeature === undefined || priceDataSelectionForFeature === undefined) return false; // One is undefined, mismatch


      const canonicalUserValue = getCanonicalFeatureValue(userSelectionForFeature);
      const canonicalPriceDataValue = getCanonicalFeatureValue(priceDataSelectionForFeature);
      
      return canonicalUserValue === canonicalPriceDataValue;
    });
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
    const selectedValue = selections.featureSelections[featureConfig.id];
    if (selectedValue) {
      if (Array.isArray(selectedValue)) { // Multi-select
        const optionLabels = selectedValue.map(optId => {
          const option = featureConfig.options.find(o => o.id === optId);
          return option ? option.label : '';
        }).filter(label => label);
        if (optionLabels.length > 0) {
          featureParts.push(`${featureConfig.name}: ${optionLabels.join(' & ')}`);
        }
      } else { // Single-select
        const option = featureConfig.options.find(o => o.id === selectedValue);
        if (option) {
          featureParts.push(`${featureConfig.name}: ${option.label}`);
        }
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
  if (!category) return { finalImageUrl: category?.imagePlaceholder || 'https://picsum.photos/400/300', finalImageAiHint: category?.imageAiHint || 'furniture' };

  let finalImageUrl = category.imagePlaceholder;
  let finalImageAiHint = category.imageAiHint;
  
  if (selections.sizeId) {
    const sizeConfig = category.sizes.find(s => s.id === selections.sizeId);
    if (sizeConfig?.imagePlaceholder) {
      finalImageUrl = sizeConfig.imagePlaceholder;
      finalImageAiHint = sizeConfig.imageAiHint || sizeConfig.label;
    }
  }
  
  for (const feature of category.features) {
    const selectedValue = selections.featureSelections[feature.id];
    if (selectedValue) {
      const firstSelectedOptionId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
      if (firstSelectedOptionId) {
        const option = feature.options.find(opt => opt.id === firstSelectedOptionId);
        if (option?.imagePlaceholder) {
          finalImageUrl = option.imagePlaceholder;
          finalImageAiHint = option.imageAiHint || option.label;
          break; 
        }
      }
    }
  }
  return { finalImageUrl, finalImageAiHint };
}

// Helper to generate power set for multi-select options
function getPowerSet<T>(array: T[]): T[][] {
    const result: T[][] = [[]];
    for (const value of array) {
        const length = result.length;
        for (let i = 0; i < length; i++) {
            result.push(result[i].concat(value));
        }
    }
    return result.filter(subset => subset.length > 0); // Exclude empty set
}


export function getAllPossibleCombinationsWithPrices(): DisplayablePriceEntry[] {
  const allCombinations: DisplayablePriceEntry[] = [];

  FURNITURE_CATEGORIES.forEach(category => {
    const generateFeaturePermutations = (
      featureIndex: number,
      currentSelections: Record<string, string | string[]>
    ): Record<string, string | string[]>[] => {
      if (featureIndex >= category.features.length) {
        return [currentSelections];
      }

      const feature = category.features[featureIndex];
      let permutations: Record<string, string | string[]>[] = [];

      if (feature.options.length === 0) {
        return generateFeaturePermutations(featureIndex + 1, currentSelections);
      }

      if (feature.selectionType === 'multiple') {
        const optionSubsets = getPowerSet(feature.options.map(opt => opt.id));
        if (optionSubsets.length === 0) { // Should not happen if getPowerSet excludes empty and feature has options
             permutations = permutations.concat(
                generateFeaturePermutations(featureIndex + 1, currentSelections)
            );
        } else {
            optionSubsets.forEach(subset => {
              if (subset.length > 0) { // Ensure we only process non-empty subsets
                const nextSelections = {
                  ...currentSelections,
                  [feature.id]: subset.sort().join(','), // Store as canonical string
                };
                permutations = permutations.concat(
                  generateFeaturePermutations(featureIndex + 1, nextSelections)
                );
              }
            });
        }
         // Case where "no option selected" for a multi-select might be valid (if feature itself is optional)
         // For now, assuming at least one must be selected if options exist for multi-select to form a combination.
         // If a multi-select can be "empty", add:
         // permutations = permutations.concat(generateFeaturePermutations(featureIndex + 1, currentSelections));

      } else { // single-select
        for (const option of feature.options) {
          const nextSelections = {
            ...currentSelections,
            [feature.id]: option.id,
          };
          permutations = permutations.concat(
            generateFeaturePermutations(featureIndex + 1, nextSelections)
          );
        }
      }
      return permutations;
    };

    const featurePermutations: Record<string, string | string[]>[] = category.features.length > 0
      ? generateFeaturePermutations(0, {})
      : [{}]; 

    if (category.sizes.length === 0) return; 

    category.sizes.forEach(size => {
      featurePermutations.forEach(currentFeatureSelections => {
        const relevantFeatureSelections: Record<string, string | string[]> = {};
        category.features.forEach(f => {
            if(currentFeatureSelections[f.id] !== undefined) { // Check for undefined
                relevantFeatureSelections[f.id] = currentFeatureSelections[f.id];
            }
        });

        const userSelections: UserSelections = {
          categoryId: category.id,
          featureSelections: relevantFeatureSelections,
          sizeId: size.id,
        };
        
        const fullDescription = generateItemDescription(userSelections, FURNITURE_CATEGORIES);
        const existingPriceEntry = getEstimatedPrice(category.id, relevantFeatureSelections, size.id);

        const featureParts: string[] = [];
        category.features.forEach(fConf => {
          const selectedValue = relevantFeatureSelections[fConf.id];
          if (selectedValue) {
            if (Array.isArray(selectedValue)) { // Should be canonical string from permutation
                const optionLabels = selectedValue.map(id => fConf.options.find(o => o.id === id)?.label).filter(Boolean);
                if(optionLabels.length > 0) featureParts.push(`${fConf.name}: ${optionLabels.join(' & ')}`);

            } else if (typeof selectedValue === 'string' && fConf.selectionType === 'multiple') {
                 const ids = selectedValue.split(',');
                 const optionLabels = ids.map(id => fConf.options.find(o => o.id === id)?.label).filter(Boolean);
                 if(optionLabels.length > 0) featureParts.push(`${fConf.name}: ${optionLabels.join(' & ')}`);
            }
             else { // single select or already processed multi-select string
              const opt = fConf.options.find(o => o.id === selectedValue);
              if (opt) featureParts.push(`${fConf.name}: ${opt.label}`);
            }
          }
        });
        const featureDescription = featureParts.join(', ') || 'N/A';

        allCombinations.push({
          categoryId: category.id,
          categoryName: category.name,
          featureSelections: relevantFeatureSelections,
          featureDescription: featureDescription,
          sizeId: size.id,
          sizeLabel: size.label,
          priceRange: existingPriceEntry ? existingPriceEntry.priceRange : { min: 0, max: 0 },
          description: fullDescription,
          isPriced: !!existingPriceEntry,
        });
      });
    });
  });

  return allCombinations;
}

export const updateOrAddPriceData = (entry: PriceDataEntry): PriceDataEntry | null => {
  const category = FURNITURE_CATEGORIES.find(c => c.id === entry.categoryId);
  if (!category) return null;

  if (entry.priceRange.min < 0 || entry.priceRange.max < 0 || entry.priceRange.min > entry.priceRange.max) {
    console.error("Invalid price range for update/add:", entry.priceRange);
    return null;
  }
  
  // Ensure featureSelections are in canonical form for comparison and storage
  const canonicalEntrySelections: Record<string, string> = {};
  category.features.forEach(featConf => {
      const val = entry.featureSelections[featConf.id];
      if (val !== undefined) { // only process if defined
          canonicalEntrySelections[featConf.id] = getCanonicalFeatureValue(val);
      }
  });

  const index = PRICE_DATA.findIndex(p => {
    if (p.categoryId !== entry.categoryId || p.sizeId !== entry.sizeId) return false;
    
    // Compare canonical forms of feature selections
    const pCanonicalSelections: Record<string, string> = {};
    category.features.forEach(featConf => {
        const val = p.featureSelections[featConf.id];
         if (val !== undefined) {
            pCanonicalSelections[featConf.id] = getCanonicalFeatureValue(val);
        }
    });

    if (Object.keys(canonicalEntrySelections).length !== Object.keys(pCanonicalSelections).length) return false;
    return Object.keys(canonicalEntrySelections).every(featId => canonicalEntrySelections[featId] === pCanonicalSelections[featId]);
  });


  if (index !== -1) {
    PRICE_DATA[index].priceRange = entry.priceRange;
    // Ensure stored selections are also canonical
    PRICE_DATA[index].featureSelections = canonicalEntrySelections; 
    return PRICE_DATA[index];
  } else {
    const newPriceEntry: PriceDataEntry = { 
        ...entry, 
        featureSelections: canonicalEntrySelections // Store with canonical feature values
    };
    PRICE_DATA.push(newPriceEntry);
    return newPriceEntry;
  }
};
