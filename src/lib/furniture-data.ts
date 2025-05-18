
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
    return true;
  } catch (error) {
    console.error("Error deleting category from Firestore:", error);
    return false;
  }
};


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
      const data = priceDocSnap.data();
      // Document stores { priceRange: PriceRange, overrideImageUrl?: string, overrideImageAiHint?: string }
      return {
        categoryId,
        featureSelections: featureSelectionsFromUser,
        sizeId,
        priceRange: data.priceRange as PriceRange,
        overrideImageUrl: data.overrideImageUrl as string | undefined,
        overrideImageAiHint: data.overrideImageAiHint as string | undefined,
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
): { finalImageUrl: string; finalImageAiHint: string } {
  const defaultImage = 'https://placehold.co/400x300.png';
  const defaultHint = 'furniture item';

  if (!selections.categoryId) return { finalImageUrl: defaultImage, finalImageAiHint: defaultHint };

  const category = allCategoriesData.find(c => c.id === selections.categoryId);
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

      if ((feature.options || []).length === 0 && (category.features || []).length > 0) {
         return generateFeaturePermutations(featureIndex + 1, currentSelections);
      }
      
      if (feature.selectionType === 'multiple') {
        const optionSubsets = getPowerSet((feature.options || []).map(opt => opt.id));
        optionSubsets.forEach(subset => {
            if (subset.length > 0 || (feature.options || []).length === 0) {
                 const nextSelections = {
                    ...currentSelections,
                    ...(subset.length > 0 && { [feature.id]: subset.sort() }) 
                };
                permutations = permutations.concat(
                    generateFeaturePermutations(featureIndex + 1, nextSelections)
                );
            }
        });
         if (permutations.length === 0 && (feature.options || []).length > 0) {
             permutations = permutations.concat(generateFeaturePermutations(featureIndex + 1, currentSelections));
         }
      } else { 
        if ((feature.options || []).length === 0) {
            permutations = permutations.concat(
                generateFeaturePermutations(featureIndex + 1, currentSelections)
            );
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
      }
      return permutations;
    };

    const featurePermutations: Record<string, string | string[]>[] = (category.features || []).length > 0
      ? generateFeaturePermutations(0, {})
      : [{}]; 

    if ((category.sizes || []).length === 0) continue; 

    const sizesToIterate = category.sizes;

    for (const size of sizesToIterate) {
      for (const currentFeatureSelections of featurePermutations) {
        const userSelections: UserSelections = {
          categoryId: category.id,
          featureSelections: currentFeatureSelections,
          sizeId: size.id,
        };
        
        const fullDescription = generateItemDescription(userSelections, categoriesFromFirestore);
        const existingPriceEntry = await getEstimatedPrice(category.id, currentFeatureSelections, size.id, categoriesFromFirestore);
        
        let displayImageUrl: string;
        let displayImageAiHint: string;

        if (existingPriceEntry?.overrideImageUrl) {
          displayImageUrl = existingPriceEntry.overrideImageUrl;
          displayImageAiHint = existingPriceEntry.overrideImageAiHint || category.name.toLowerCase();
        } else {
          const derivedImage = getFinalImageForSelections(userSelections, categoriesFromFirestore);
          displayImageUrl = derivedImage.finalImageUrl;
          displayImageAiHint = derivedImage.finalImageAiHint;
        }
        
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
        const featureDescription = featureParts.join(', ') || (((category.features || []).length > 0) ? 'Base Configuration' : 'N/A');
        
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
          imageUrl: displayImageUrl,
          imageAiHint: displayImageAiHint,
          overrideImageUrl: existingPriceEntry?.overrideImageUrl,
          overrideImageAiHint: existingPriceEntry?.overrideImageAiHint,
        });
      }
    }
  }
  return allCombinations;
}

export async function updateOrAddPriceData(
  entry: PriceDataEntry,
  _categoriesFromFirestore: FurnitureCategory[]
): Promise<PriceDataEntry | null> {
  if (entry.priceRange.min < 0 || entry.priceRange.max < 0 || entry.priceRange.min > entry.priceRange.max) {
    console.error("Invalid price range for update/add:", entry.priceRange);
    return null;
  }
  
  const priceDocId = generatePriceDocumentId(entry.categoryId, entry.featureSelections, entry.sizeId);

  try {
    const priceDocRef = doc(db, PRICES_COLLECTION, priceDocId);
    const dataToSave: {
      priceRange: PriceRange;
      overrideImageUrl?: string;
      overrideImageAiHint?: string;
    } = {
      priceRange: entry.priceRange,
    };

    if (entry.overrideImageUrl) {
      dataToSave.overrideImageUrl = entry.overrideImageUrl;
      dataToSave.overrideImageAiHint = entry.overrideImageAiHint || '';
    } else {
      // If overrideImageUrl is explicitly set to empty or null, ensure it's removed from Firestore.
      // Firestore treats undefined fields as "do not change" in merge, but null/empty will remove.
      // To be safe, we can explicitly set them to null if they are meant to be cleared.
      dataToSave.overrideImageUrl = ''; // Or use deleteField() if you want to remove the field entirely
      dataToSave.overrideImageAiHint = '';
    }
    
    await setDoc(priceDocRef, dataToSave, { merge: true }); // Use merge to avoid overwriting other fields if any
    return entry;
  } catch (error) {
    console.error("Error saving price to Firestore:", error);
    return null;
  }
}
