
import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig, UserSelections, DisplayablePriceEntry, PriceRange } from '@/lib/definitions';
import { generateId } from '@/lib/utils';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

// --- Firestore Collection References ---
const CATEGORIES_COLLECTION = 'categories';
const PRICES_COLLECTION = 'prices';

// Helper to convert array of option IDs to a canonical string form (sorted, comma-separated)
// and to handle single string values consistently.
export const getCanonicalFeatureValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    if (value.length === 0) return ''; // Handle empty array explicitly
    return value.slice().sort().join(','); // Use slice() to avoid mutating original array before sort
  }
  return value || ''; // Return empty string if undefined or already a string (could be empty)
};

// New helper function to generate a deterministic document ID for price entries
const generatePriceDocumentId = (
  categoryId: string,
  featureSelections: Record<string, string | string[]>,
  sizeId: string
): string => {
  const canonicalFeatures: string[] = [];
  Object.keys(featureSelections)
    .sort() // Sort keys for consistent order
    .forEach(featureId => {
      const canonicalValue = getCanonicalFeatureValue(featureSelections[featureId]);
      if (canonicalValue) { // Only include features that have a selection
        canonicalFeatures.push(`${featureId}=${canonicalValue}`);
      }
    });
  const featuresString = canonicalFeatures.join(';');
  // Replace characters not suitable for Firestore IDs if necessary, but Firestore is quite flexible.
  // Using underscores and hyphens should be safe.
  return `${categoryId}_${featuresString}_${sizeId}`.replace(/[^a-zA-Z0-9_.;=-]/g, '-');
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
    return [];
  }
};

export const addFirebaseCategory = async (categoryData: Omit<FurnitureCategory, 'id'>): Promise<FurnitureCategory | null> => {
  try {
    const newId = categoryData.name.toLowerCase().replace(/\s+/g, '-') + '-' + generateId('fbcat');
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
    // Note: Deleting associated price data from Firestore would require more complex logic
    // (querying for all price documents with this categoryId and deleting them).
    // This is not implemented here for simplicity in this step.
    return true;
  } catch (error) {
    console.error("Error deleting category from Firestore:", error);
    return false;
  }
};


// == Local In-Memory Data (FURNITURE_CATEGORIES is now primarily a fallback or for initial seeding ideas) ==
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

// PRICE_DATA is now managed in Firestore. This array is no longer the source of truth.
// It's kept here for reference or potential one-time seeding scripts.
/*
export let PRICE_DATA: PriceDataEntry[] = [
  // ... (old price data commented out)
];
*/

// == Pricing and Description Logic ==

// getEstimatedPrice now fetches from Firestore.
export async function getEstimatedPrice(
  categoryId: string | null,
  featureSelectionsFromUser: Record<string, string | string[]>,
  sizeId: string | null,
  _availableCategories: FurnitureCategory[] // _availableCategories might not be strictly needed if IDs are globally unique and structure is known
): Promise<PriceDataEntry | null> {
  if (!categoryId || !sizeId) return null;

  const priceDocId = generatePriceDocumentId(categoryId, featureSelectionsFromUser, sizeId);
  
  try {
    const priceDocRef = doc(db, PRICES_COLLECTION, priceDocId);
    const priceDocSnap = await getDoc(priceDocRef);

    if (priceDocSnap.exists()) {
      const priceRange = priceDocSnap.data() as PriceRange;
      return {
        categoryId,
        featureSelections: featureSelectionsFromUser, // Return the user's selections for context
        sizeId,
        priceRange,
      };
    } else {
      return null; // No price found for this specific combination
    }
  } catch (error) {
    console.error("Error fetching price from Firestore:", error);
    return null;
  }
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

  // Ensure features array exists before iterating
  (category.features || []).forEach(featureConfig => {
    const selectedValue = selections.featureSelections[featureConfig.id];
    if (selectedValue) {
      const optionsToSearch = featureConfig.options || [];
      if (Array.isArray(selectedValue)) {
        const optionLabels = selectedValue.map(optId => {
          const option = optionsToSearch.find(o => o.id === optId);
          return option ? option.label : '';
        }).filter(label => label);
        if (optionLabels.length > 0) {
          featureParts.push(`${featureConfig.name}: ${optionLabels.join(' & ')}`);
        }
      } else {
        const option = optionsToSearch.find(o => o.id === selectedValue);
        if (option) {
          featureParts.push(`${featureConfig.name}: ${option.label}`);
        }
      }
    }
  });
  if (featureParts.length > 0) {
    description += ` (${featureParts.join(', ')})`;
  }

  if (selections.sizeId) {
    const sizesToSearch = category.sizes || [];
    const size = sizesToSearch.find(s => s.id === selections.sizeId);
    if (size) {
      description += `, Size: ${size.label}`;
    }
  }
  return description;
}

export function getFinalImageForSelections(
  selections: UserSelections,
  allCategoriesData: FurnitureCategory[]
): { finalImageUrl: string | null; finalImageAiHint: string | null } {
  if (!selections.categoryId) return { finalImageUrl: null, finalImageAiHint: null };

  const category = allCategoriesData.find(c => c.id === selections.categoryId);
  const defaultImage = 'https://placehold.co/400x300.png';
  const defaultHint = 'furniture';

  if (!category) return { finalImageUrl: defaultImage, finalImageAiHint: defaultHint };

  let finalImageUrl = category.imagePlaceholder || defaultImage;
  let finalImageAiHint = category.imageAiHint || category.name.toLowerCase() || defaultHint;
  
  if (selections.sizeId) {
    const sizeConfig = (category.sizes || []).find(s => s.id === selections.sizeId);
    if (sizeConfig?.imagePlaceholder) {
      finalImageUrl = sizeConfig.imagePlaceholder;
      finalImageAiHint = sizeConfig.imageAiHint || sizeConfig.label.toLowerCase();
    }
  }
  
  for (const feature of (category.features || [])) {
    const selectedValue = selections.featureSelections[feature.id];
    if (selectedValue) {
      const firstSelectedOptionId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
      if (firstSelectedOptionId) {
        const option = (feature.options || []).find(opt => opt.id === firstSelectedOptionId);
        if (option?.imagePlaceholder) {
          finalImageUrl = option.imagePlaceholder;
          finalImageAiHint = option.imageAiHint || option.label.toLowerCase();
          break; 
        }
      }
    }
  }
  return { finalImageUrl, finalImageAiHint };
}

function getPowerSet<T>(array: T[]): T[][] {
    const result: T[][] = [[]]; 
    for (const value of array) {
        const length = result.length;
        for (let i = 0; i < length; i++) {
            result.push(result[i].concat(value));
        }
    }
    return result;
}

export async function getAllPossibleCombinationsWithPrices(
  categoriesFromFirestore: FurnitureCategory[]
): Promise<DisplayablePriceEntry[]> {
  const allCombinations: DisplayablePriceEntry[] = [];

  for (const category of categoriesFromFirestore) {
    const generateFeaturePermutations = (
      featureIndex: number,
      currentSelections: Record<string, string | string[]>
    ): Record<string, string | string[]>[] => {
      if (featureIndex >= (category.features || []).length) {
        return [currentSelections];
      }
      const feature = (category.features || [])[featureIndex];
      let permutations: Record<string, string | string[]>[] = [];

      if ((feature.options || []).length === 0) {
        return generateFeaturePermutations(featureIndex + 1, currentSelections);
      }

      if (feature.selectionType === 'multiple') {
        const optionSubsets = getPowerSet((feature.options || []).map(opt => opt.id));
        optionSubsets.forEach(subset => {
            const nextSelections = {
                ...currentSelections,
                ...(subset.length > 0 && { [feature.id]: subset.sort() }) 
            };
            permutations = permutations.concat(
                generateFeaturePermutations(featureIndex + 1, nextSelections)
            );
        });
      } else { 
        (feature.options || []).forEach(option => {
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

    const featurePermutations: Record<string, string | string[]>[] = (category.features || []).length > 0
      ? generateFeaturePermutations(0, {})
      : [{}];

    if ((category.sizes || []).length === 0 && (category.features || []).length > 0) continue; 

    const sizesToIterate = (category.sizes || []).length > 0 ? category.sizes : [{id: 'default-size', label:'Standard'} as FurnitureSizeConfig];

    for (const size of sizesToIterate) {
      for (const currentFeatureSelections of featurePermutations) {
        const userSelections: UserSelections = {
          categoryId: category.id,
          featureSelections: currentFeatureSelections,
          sizeId: size.id,
        };
        
        const fullDescription = generateItemDescription(userSelections, categoriesFromFirestore);
        // getEstimatedPrice is now async
        const existingPriceEntry = await getEstimatedPrice(category.id, currentFeatureSelections, size.id, categoriesFromFirestore);
        
        const featureParts: string[] = [];
        (category.features || []).forEach(fConf => {
          const selectedValue = currentFeatureSelections[fConf.id];
          if (selectedValue) {
            const selectedOptionLabels = (Array.isArray(selectedValue) ? selectedValue : [selectedValue])
              .map(optId => (fConf.options || []).find(o => o.id === optId)?.label)
              .filter(Boolean) as string[];
            if (selectedOptionLabels.length > 0) {
              featureParts.push(`${fConf.name}: ${selectedOptionLabels.join(' & ')}`);
            }
          }
        });
        const featureDescription = featureParts.join(', ') || ((category.features || []).length > 0 ? 'Base Model' : 'N/A');
        
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
      }
    }
  }
  return allCombinations;
}


// updateOrAddPriceData now writes to Firestore.
export async function updateOrAddPriceData(
  entry: PriceDataEntry,
  _categoriesFromFirestore: FurnitureCategory[] // _categoriesFromFirestore might not be needed if IDs are globally unique
): Promise<PriceDataEntry | null> {
  if (entry.priceRange.min < 0 || entry.priceRange.max < 0 || entry.priceRange.min > entry.priceRange.max) {
    console.error("Invalid price range for update/add:", entry.priceRange);
    return null;
  }
  
  const priceDocId = generatePriceDocumentId(entry.categoryId, entry.featureSelections, entry.sizeId);

  try {
    const priceDocRef = doc(db, PRICES_COLLECTION, priceDocId);
    // Only store the priceRange object in Firestore document.
    // The ID itself contains all the selection criteria.
    await setDoc(priceDocRef, entry.priceRange); 
    return entry; // Return the original entry to confirm what was intended to be saved.
  } catch (error) {
    console.error("Error saving price to Firestore:", error);
    return null;
  }
}

    