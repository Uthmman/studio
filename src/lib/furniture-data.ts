
import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig, UserSelections, DisplayablePriceEntry } from '@/lib/definitions';
import { generateId } from '@/lib/utils';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// --- Firestore Collection References ---
const CATEGORIES_COLLECTION = 'categories';
// const PRICES_COLLECTION = 'prices'; // Will be used later

// Helper to convert array of option IDs to a canonical string form (sorted, comma-separated)
// and to handle single string values consistently.
export const getCanonicalFeatureValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value.sort().join(',');
  }
  return value || ''; // Return empty string if undefined or already a string (could be empty)
};


// == Firestore Functions for Categories ==

export const getFirebaseCategories = async (): Promise<FurnitureCategory[]> => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const categoriesList = categoriesSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as FurnitureCategory));
    return categoriesList;
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
    return []; // Return empty array on error
  }
};

export const addFirebaseCategory = async (categoryData: Omit<FurnitureCategory, 'id'>): Promise<FurnitureCategory | null> => {
  try {
    const newId = categoryData.name.toLowerCase().replace(/\s+/g, '-') + '-' + generateId('fbcat'); // Make ID more readable
    const newCategory: FurnitureCategory = {
      ...categoryData,
      id: newId,
    };
    await setDoc(doc(db, CATEGORIES_COLLECTION, newId), newCategory);
    return newCategory;
  } catch (error) {
    console.error("Error adding category to Firestore:", error);
    return null;
  }
};

export const updateFirebaseCategory = async (categoryData: FurnitureCategory): Promise<FurnitureCategory | null> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryData.id);
    await setDoc(categoryRef, categoryData, { merge: true });
    return categoryData;
  } catch (error) {
    console.error("Error updating category in Firestore:", error);
    return null;
  }
};

export const deleteFirebaseCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(categoryRef);
    // Local PRICE_DATA cleanup (still relevant as long as PRICE_DATA is local)
    PRICE_DATA = PRICE_DATA.filter(p => p.categoryId !== categoryId);
    return true;
  } catch (error) {
    console.error("Error deleting category from Firestore:", error);
    return false;
  }
};


// == Local In-Memory Data (PRICE_DATA is still local) ==
// FURNITURE_CATEGORIES is now primarily a fallback or for initial seeding ideas.
// The estimator and admin panel will fetch categories from Firestore.

export let FURNITURE_CATEGORIES: FurnitureCategory[] = [
  {
    id: 'sofas',
    name: 'Sofas',
    iconName: 'Sofa',
    imagePlaceholder: 'https://placehold.co/400x300.png',
    imageAiHint: 'living room sofa',
    features: [
      {
        id: 'sofas-feat-seats',
        name: 'Number of Seats',
        selectionType: 'single',
        options: [
          { id: 'sofas-feat-seats-opt-2', label: '2-Seater', iconName: 'Users', imagePlaceholder: 'https://placehold.co/100x75.png', imageAiHint: 'small sofa' },
          { id: 'sofas-feat-seats-opt-3', label: '3-Seater', iconName: 'Users', imagePlaceholder: 'https://placehold.co/100x75.png', imageAiHint: 'medium sofa' },
          { id: 'sofas-feat-seats-opt-sectional', label: 'Sectional', iconName: 'GalleryVerticalEnd', imagePlaceholder: 'https://placehold.co/100x75.png', imageAiHint: 'large sofa' },
        ],
      },
      {
        id: 'sofas-feat-material',
        name: 'Upholstery Material',
        selectionType: 'single',
        options: [
          { id: 'sofas-feat-material-opt-fabric', label: 'Fabric', iconName: 'GalleryThumbnails', imagePlaceholder: 'https://placehold.co/50x50.png', imageAiHint: 'fabric texture' },
          { id: 'sofas-feat-material-opt-leather', label: 'Leather', iconName: 'Option', imagePlaceholder: 'https://placehold.co/50x50.png', imageAiHint: 'leather texture' },
          { id: 'sofas-feat-material-opt-velvet', label: 'Velvet', iconName: 'Sparkles', imagePlaceholder: 'https://placehold.co/50x50.png', imageAiHint: 'velvet texture' },
        ],
      },
      {
        id: 'sofas-feat-style',
        name: 'Style',
        selectionType: 'multiple',
        options: [
          { id: 'sofas-feat-style-opt-modern', label: 'Modern', iconName: 'Zap', imagePlaceholder: 'https://placehold.co/100x75.png', imageAiHint: 'modern sofa' },
          { id: 'sofas-feat-style-opt-traditional', label: 'Traditional', iconName: 'Grape', imagePlaceholder: 'https://placehold.co/100x75.png', imageAiHint: 'classic sofa' },
          { id: 'sofas-feat-style-opt-midcentury', label: 'Mid-Century', iconName: 'Sun', imagePlaceholder: 'https://placehold.co/100x75.png', imageAiHint: 'retro sofa' },
        ],
      },
    ],
    sizes: [
      { id: 'sofas-size-small', label: 'Small (50-69 inches)', iconName: 'Minimize2', imagePlaceholder: 'https://placehold.co/80x60.png', imageAiHint: 'compact furniture' },
      { id: 'sofas-size-medium', label: 'Medium (70-85 inches)', iconName: 'AppWindow', imagePlaceholder: 'https://placehold.co/80x60.png', imageAiHint: 'standard furniture' },
      { id: 'sofas-size-large', label: 'Large (86+ inches)', iconName: 'Maximize2', imagePlaceholder: 'https://placehold.co/80x60.png', imageAiHint: 'spacious furniture' },
    ],
  },
  // ... other default categories (can be removed if Firestore is source of truth and seeded)
];

export let PRICE_DATA: PriceDataEntry[] = [
  // Sofas
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-small', priceRange: { min: 300, max: 700 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-3', 'sofas-feat-material': 'sofas-feat-material-opt-fabric', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-medium', priceRange: { min: 700, max: 1600 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-sectional', 'sofas-feat-material': 'sofas-feat-material-opt-leather', 'sofas-feat-style': 'sofas-feat-style-opt-traditional' }, sizeId: 'sofas-size-large', priceRange: { min: 1500, max: 3500 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-2', 'sofas-feat-material': 'sofas-feat-material-opt-velvet', 'sofas-feat-style': 'sofas-feat-style-opt-midcentury' }, sizeId: 'sofas-size-small', priceRange: { min: 500, max: 1000 } },
  { categoryId: 'sofas', featureSelections: { 'sofas-feat-seats': 'sofas-feat-seats-opt-3', 'sofas-feat-material': 'sofas-feat-material-opt-leather', 'sofas-feat-style': 'sofas-feat-style-opt-modern' }, sizeId: 'sofas-size-medium', priceRange: { min: 1200, max: 2500 } },
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

// == Pricing and Description Logic ==

// getEstimatedPrice still uses local PRICE_DATA.
// It also needs access to the category definition to know about its features.
// If categories are fetched async, this function needs the specific category data.
export function getEstimatedPrice(
  categoryId: string | null,
  featureSelectionsFromUser: Record<string, string | string[]>,
  sizeId: string | null,
  availableCategories: FurnitureCategory[] // Pass the currently available categories
): PriceDataEntry | null {
  if (!categoryId || !sizeId) return null;

  const category = availableCategories.find(c => c.id === categoryId);
  if (!category) {
    console.warn(`Category with id ${categoryId} not found in provided categories for price estimation.`);
    return null; // Category definition needed to correctly interpret featureSelections
  }

  const entry = PRICE_DATA.find(item => {
    if (item.categoryId !== categoryId || item.sizeId !== sizeId) {
      return false;
    }
    // If category has no features, an empty featureSelections object should match
    if (category.features.length === 0) {
      return Object.keys(item.featureSelections).length === 0 && Object.keys(featureSelectionsFromUser).length === 0;
    }
    return category.features.every(featureConfig => {
      const userSelectionForFeature = featureSelectionsFromUser[featureConfig.id];
      const priceDataSelectionForFeature = item.featureSelections[featureConfig.id];

      // If a feature is defined in the category but not selected by user and not in price data, it's a match for that feature.
      // Or if a feature is defined, selected by user, and present in price data, then values must match.
      const canonicalUserValue = getCanonicalFeatureValue(userSelectionForFeature);
      const canonicalPriceDataValue = getCanonicalFeatureValue(priceDataSelectionForFeature);

      if (canonicalUserValue === '' && canonicalPriceDataValue === '') return true; // Both are considered "not set" for this feature

      return canonicalUserValue === canonicalPriceDataValue;
    });
  });
  return entry || null;
}

export function generateItemDescription(
  selections: UserSelections,
  categoriesData: FurnitureCategory[] // Now expects categories data
): string {
  if (!selections.categoryId) return "No item selected";

  const category = categoriesData.find(c => c.id === selections.categoryId);
  if (!category) return "Unknown category";

  let description = category.name;
  const featureParts: string[] = [];

  for (const featureConfig of category.features) {
    const selectedValue = selections.featureSelections[featureConfig.id];
    if (selectedValue) {
      if (Array.isArray(selectedValue)) {
        const optionLabels = selectedValue.map(optId => {
          const option = featureConfig.options.find(o => o.id === optId);
          return option ? option.label : '';
        }).filter(label => label);
        if (optionLabels.length > 0) {
          featureParts.push(`${featureConfig.name}: ${optionLabels.join(' & ')}`);
        }
      } else {
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
  allCategoriesData: FurnitureCategory[] // Now expects categories data
): { finalImageUrl: string | null; finalImageAiHint: string | null } {
  if (!selections.categoryId) return { finalImageUrl: null, finalImageAiHint: null };

  const category = allCategoriesData.find(c => c.id === selections.categoryId);
  const defaultImage = 'https://placehold.co/400x300.png';
  const defaultHint = 'furniture';

  if (!category) return { finalImageUrl: defaultImage, finalImageAiHint: defaultHint };

  let finalImageUrl = category.imagePlaceholder || defaultImage;
  let finalImageAiHint = category.imageAiHint || category.name.toLowerCase() || defaultHint;
  
  // Prioritize size image if available
  if (selections.sizeId) {
    const sizeConfig = category.sizes.find(s => s.id === selections.sizeId);
    if (sizeConfig?.imagePlaceholder) {
      finalImageUrl = sizeConfig.imagePlaceholder;
      finalImageAiHint = sizeConfig.imageAiHint || sizeConfig.label.toLowerCase();
    }
  }
  
  // Then, override with feature image if a more specific one is available from the *first* selected feature option that has an image
  for (const feature of category.features) {
    const selectedValue = selections.featureSelections[feature.id];
    if (selectedValue) {
      const firstSelectedOptionId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
      if (firstSelectedOptionId) { // Ensure there's at least one selection
        const option = feature.options.find(opt => opt.id === firstSelectedOptionId);
        if (option?.imagePlaceholder) {
          finalImageUrl = option.imagePlaceholder;
          finalImageAiHint = option.imageAiHint || option.label.toLowerCase();
          break; // Use the first feature option image found
        }
      }
    }
  }
  return { finalImageUrl, finalImageAiHint };
}

function getPowerSet<T>(array: T[]): T[][] {
    const result: T[][] = [[]]; // Include empty set for combinations where a multi-select feature might not be chosen
    for (const value of array) {
        const length = result.length;
        for (let i = 0; i < length; i++) {
            result.push(result[i].concat(value));
        }
    }
    // Return all subsets, including empty for "none selected" and single/multiple items
    // The filter for subset.length > 0 was removed to allow "no option selected" for a multi-feature
    return result;
}

//getAllPossibleCombinationsWithPrices now takes categories from Firestore
export function getAllPossibleCombinationsWithPrices(
  categoriesFromFirestore: FurnitureCategory[]
): DisplayablePriceEntry[] {
  const allCombinations: DisplayablePriceEntry[] = [];

  categoriesFromFirestore.forEach(category => {
    const generateFeaturePermutations = (
      featureIndex: number,
      currentSelections: Record<string, string | string[]> // string[] for multi-select
    ): Record<string, string | string[]>[] => {
      if (featureIndex >= category.features.length) {
        return [currentSelections];
      }
      const feature = category.features[featureIndex];
      let permutations: Record<string, string | string[]>[] = [];

      if (feature.options.length === 0) { // No options for this feature
        return generateFeaturePermutations(featureIndex + 1, currentSelections);
      }

      if (feature.selectionType === 'multiple') {
        const optionSubsets = getPowerSet(feature.options.map(opt => opt.id));
         // For multi-select, an "empty" selection (no options picked for THIS feature) is valid.
        // So, we iterate through all subsets, including the empty one.
        optionSubsets.forEach(subset => {
            const nextSelections = {
                ...currentSelections,
                ...(subset.length > 0 && { [feature.id]: subset.sort() }) // Store as array, or omit if empty
            };
            permutations = permutations.concat(
                generateFeaturePermutations(featureIndex + 1, nextSelections)
            );
        });

      } else { // Single select
        // Also include a "not selected" path for single-select if desired for price table (e.g. feature not mandatory)
        // For now, assume single-select features must have one option chosen for a "complete" combination.
        feature.options.forEach(option => {
          const nextSelections = {
            ...currentSelections,
            [feature.id]: option.id,
          };
          permutations = permutations.concat(
            generateFeaturePermutations(featureIndex + 1, nextSelections)
          );
        });
      }
      return permutations;
    };

    const featurePermutations: Record<string, string | string[]>[] = category.features.length > 0
      ? generateFeaturePermutations(0, {})
      : [{}]; // If no features, just one empty permutation

    if (category.sizes.length === 0 && category.features.length > 0) return; // Skip if features exist but no sizes

    const sizesToIterate = category.sizes.length > 0 ? category.sizes : [{id: 'default-size', label:'Standard'} as FurnitureSizeConfig];


    sizesToIterate.forEach(size => {
      featurePermutations.forEach(currentFeatureSelections => {
        const userSelections: UserSelections = {
          categoryId: category.id,
          featureSelections: currentFeatureSelections, // Already in correct format {featId: optId or optId[]}
          sizeId: size.id,
        };
        // Pass categoriesFromFirestore to generateItemDescription
        const fullDescription = generateItemDescription(userSelections, categoriesFromFirestore);
        
        // getEstimatedPrice still uses local PRICE_DATA but needs categoriesFromFirestore for context
        const existingPriceEntry = getEstimatedPrice(category.id, currentFeatureSelections, size.id, categoriesFromFirestore);
        
        const featureParts: string[] = [];
        category.features.forEach(fConf => {
          const selectedValue = currentFeatureSelections[fConf.id];
          if (selectedValue) {
            const selectedOptionLabels = (Array.isArray(selectedValue) ? selectedValue : [selectedValue])
              .map(optId => fConf.options.find(o => o.id === optId)?.label)
              .filter(Boolean) as string[];
            if (selectedOptionLabels.length > 0) {
              featureParts.push(`${fConf.name}: ${selectedOptionLabels.join(' & ')}`);
            }
          }
        });
        const featureDescription = featureParts.join(', ') || (category.features.length > 0 ? 'Base Model' : 'N/A');
        
        allCombinations.push({
          categoryId: category.id,
          categoryName: category.name,
          featureSelections: currentFeatureSelections,
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

// updateOrAddPriceData still modifies local PRICE_DATA.
// It needs categoriesFromFirestore to correctly interpret feature selections for canonicalization.
export const updateOrAddPriceData = (entry: PriceDataEntry, categoriesFromFirestore: FurnitureCategory[]): PriceDataEntry | null => {
  const category = categoriesFromFirestore.find(c => c.id === entry.categoryId);
  if (!category) {
      console.error("Category not found for price update:", entry.categoryId);
      return null;
  }

  if (entry.priceRange.min < 0 || entry.priceRange.max < 0 || entry.priceRange.min > entry.priceRange.max) {
    console.error("Invalid price range for update/add:", entry.priceRange);
    return null;
  }
  
  // Canonicalize selections based on the actual category definition
  const canonicalEntrySelections: Record<string, string> = {};
  category.features.forEach(featConf => {
      const val = entry.featureSelections[featConf.id];
      if (val !== undefined) { // Only include features that were actually part of the entry
          canonicalEntrySelections[featConf.id] = getCanonicalFeatureValue(val);
      }
  });

  const index = PRICE_DATA.findIndex(p => {
    if (p.categoryId !== entry.categoryId || p.sizeId !== entry.sizeId) return false;
    
    const pCategory = categoriesFromFirestore.find(c => c.id === p.categoryId);
    if(!pCategory) return false; // Should not happen if data is consistent

    const pCanonicalSelections: Record<string, string> = {};
    pCategory.features.forEach(featConf => {
        const val = p.featureSelections[featConf.id];
         if (val !== undefined) { // Only include features that were part of stored price data
            pCanonicalSelections[featConf.id] = getCanonicalFeatureValue(val);
        }
    });

    // Check if all keys in canonicalEntrySelections are in pCanonicalSelections and vice-versa, and values match
    const entryKeys = Object.keys(canonicalEntrySelections);
    const pKeys = Object.keys(pCanonicalSelections);

    if (entryKeys.length !== pKeys.length) return false;
    return entryKeys.every(featId => canonicalEntrySelections[featId] === pCanonicalSelections[featId]);
  });

  const entryToSave = { ...entry, featureSelections: canonicalEntrySelections };

  if (index !== -1) {
    PRICE_DATA[index] = entryToSave;
    return PRICE_DATA[index];
  } else {
    PRICE_DATA.push(entryToSave);
    return entryToSave;
  }
};
