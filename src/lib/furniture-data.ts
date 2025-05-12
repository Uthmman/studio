import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig, UserSelections, DisplayablePriceEntry } from '@/lib/definitions';
import { generateId } from '@/lib/utils';

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
    // More robust: filter out price entries that depended on this specific feature existing.
    // This is complex as a feature deletion changes the "shape" of valid combinations.
    // For now, just deleting the specific selection is a basic step. A full cleanup might be needed.
    PRICE_DATA = PRICE_DATA.filter(p => !(p.categoryId === categoryId && p.featureSelections[featureId]));


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
      PRICE_DATA = PRICE_DATA.filter(p => !(p.categoryId === categoryId && p.featureSelections[featureId] === optionId));
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
    
    const priceEntryFeatureKeys = Object.keys(item.featureSelections);
    const selectionFeatureKeys = Object.keys(featureSelections);

    // For categories with no features, direct match on categoryId and sizeId is enough if item.featureSelections is empty.
    if (category.features.length === 0) {
      return priceEntryFeatureKeys.length === 0;
    }

    // For categories with features, the number of selected features in the price entry
    // must match the number of features relevant to the user's selection for that category.
    // And all feature selections must match.
    if (priceEntryFeatureKeys.length !== selectionFeatureKeys.length) { // Could also use category.features.length if all must be defined
        // This check ensures that the price entry is for the exact set of features selected.
        // A more complex system might allow partial matches or default prices if a feature isn't specified in PRICE_DATA.
        // For now, we expect PRICE_DATA to be specific.
        // A price entry should only contain keys for features defined in its category.
        // And the user's selection should also align with defined features.
        // This comparison is essentially checking if featureSelections objects are identical in terms of keys and values.
        return false;
    }

    return priceEntryFeatureKeys.every(key => item.featureSelections[key] === featureSelections[key]);
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
  if (!category) return { finalImageUrl: category?.imagePlaceholder || 'https://picsum.photos/400/300', finalImageAiHint: category?.imageAiHint || 'furniture' };

  let finalImageUrl = category.imagePlaceholder;
  let finalImageAiHint = category.imageAiHint;
  
  // Start with category image
  // Override with size image if available and more specific
  if (selections.sizeId) {
    const sizeConfig = category.sizes.find(s => s.id === selections.sizeId);
    if (sizeConfig?.imagePlaceholder) {
      finalImageUrl = sizeConfig.imagePlaceholder;
      finalImageAiHint = sizeConfig.imageAiHint || sizeConfig.label;
    }
  }
  
  // Override with feature option image if available and even more specific
  // This takes the image of the *first* selected feature option that has one.
  for (const feature of category.features) {
    const selectedOptionId = selections.featureSelections[feature.id];
    if (selectedOptionId) {
      const option = feature.options.find(opt => opt.id === selectedOptionId);
      if (option?.imagePlaceholder) {
        finalImageUrl = option.imagePlaceholder;
        finalImageAiHint = option.imageAiHint || option.label;
        break; // Use the first feature option image found
      }
    }
  }

  return { finalImageUrl, finalImageAiHint };
}


export function getAllPossibleCombinationsWithPrices(): DisplayablePriceEntry[] {
  const allCombinations: DisplayablePriceEntry[] = [];

  FURNITURE_CATEGORIES.forEach(category => {
    // Helper to generate all permutations of feature selections
    const generateFeaturePermutations = (
      featureIndex: number,
      currentSelections: Record<string, string>
    ): Record<string, string>[] => {
      if (featureIndex >= category.features.length) {
        // Base case: all features processed, return this specific combination
        return [currentSelections];
      }

      const feature = category.features[featureIndex];
      let permutations: Record<string, string>[] = [];

      if (feature.options.length === 0) { 
        // If a feature has no options, it can't form a valid part of a combination.
        // This path should technically not be hit if forms ensure options exist.
        // Treat as if this feature path doesn't yield further combinations.
        // Or, if a feature can be "skipped", logic would be different. Assuming features *must* be selected if they exist.
        return generateFeaturePermutations(featureIndex + 1, currentSelections); // Effectively skips this feature if no options
      }

      for (const option of feature.options) {
        const nextSelections = {
          ...currentSelections,
          [feature.id]: option.id,
        };
        permutations = permutations.concat(
          generateFeaturePermutations(featureIndex + 1, nextSelections)
        );
      }
      return permutations;
    };

    const featurePermutations: Record<string, string>[] = category.features.length > 0
      ? generateFeaturePermutations(0, {})
      : [{}]; // If no features, there's one "combination" of features: an empty one.

    if (category.sizes.length === 0) return; // A category must have sizes to be priceable

    category.sizes.forEach(size => {
      featurePermutations.forEach(currentFeatureSelections => {
        // Make sure currentFeatureSelections only contains keys relevant to this category's features
        const relevantFeatureSelections: Record<string, string> = {};
        category.features.forEach(f => {
            if(currentFeatureSelections[f.id]) {
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
          const optId = relevantFeatureSelections[fConf.id];
          if (optId) {
            const opt = fConf.options.find(o => o.id === optId);
            if (opt) featureParts.push(`${fConf.name}: ${opt.label}`);
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

  const index = PRICE_DATA.findIndex(p =>
    p.categoryId === entry.categoryId &&
    p.sizeId === entry.sizeId &&
    Object.keys(entry.featureSelections).length === Object.keys(p.featureSelections).length &&
    Object.keys(entry.featureSelections).every(featId => entry.featureSelections[featId] === p.featureSelections[featId])
  );

  if (entry.priceRange.min < 0 || entry.priceRange.max < 0 || entry.priceRange.min > entry.priceRange.max) {
    console.error("Invalid price range for update/add:", entry.priceRange);
    return null; // Or throw error
  }

  if (index !== -1) {
    // Update existing entry
    PRICE_DATA[index].priceRange = entry.priceRange;
    return PRICE_DATA[index];
  } else {
    // Add new entry
    // Ensure featureSelections only contain valid features for the category
    const validFeatureSelections: Record<string, string> = {};
    if (category.features && category.features.length > 0) {
        category.features.forEach(feat => {
            if (entry.featureSelections[feat.id]) {
                validFeatureSelections[feat.id] = entry.featureSelections[feat.id];
            }
        });
    }
    const newPriceEntry: PriceDataEntry = { ...entry, featureSelections: validFeatureSelections };
    PRICE_DATA.push(newPriceEntry);
    return newPriceEntry;
  }
};
