
import type { FurnitureCategory, PriceDataEntry, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig, UserSelections, DisplayablePriceEntry, PriceRange } from '@/lib/definitions';
import { generateId } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

const CATEGORIES_COLLECTION = 'categories';
const PRICES_COLLECTION = 'prices';

export const getCanonicalFeatureValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    return value.slice().sort().join(',');
  }
  return value || '';
};

const generatePriceDocumentId = (
  categoryId: string,
  featureSelections: Record<string, string | string[]>,
  sizeId: string
): string => {
  const canonicalFeatures: string[] = [];
  Object.keys(featureSelections)
    .sort()
    .forEach(featureId => {
      const canonicalValue = getCanonicalFeatureValue(featureSelections[featureId]);
      if (canonicalValue) {
        canonicalFeatures.push(`${featureId}=${canonicalValue}`);
      }
    });
  const featuresString = canonicalFeatures.join(';');
  return `${categoryId}_${featuresString}_${sizeId}`.replace(/[^a-zA-Z0-9_.;=-]/g, '-');
};

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
      features: categoryData.features || [],
      sizes: categoryData.sizes || [],
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
    const categoryToUpdate: FurnitureCategory = {
        ...categoryData,
        features: categoryData.features || [],
        sizes: categoryData.sizes || [],
    };
    await setDoc(categoryRef, categoryToUpdate, { merge: true });
    return categoryToUpdate;
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

export async function getEstimatedPrice(
  categoryId: string | null,
  featureSelectionsFromUser: Record<string, string | string[]>,
  sizeId: string | null,
  _availableCategories: FurnitureCategory[] // Keep for signature consistency if other parts rely on it, but Firestore is source of truth for data.
): Promise<PriceDataEntry | null> {
  if (!categoryId || !sizeId) return null;
  const priceDocId = generatePriceDocumentId(categoryId, featureSelectionsFromUser, sizeId);
  try {
    const priceDocRef = doc(db, PRICES_COLLECTION, priceDocId);
    const priceDocSnap = await getDoc(priceDocRef);
    if (priceDocSnap.exists()) {
      const data = priceDocSnap.data();
      const priceRange = data.priceRange && typeof data.priceRange.min === 'number' && typeof data.priceRange.max === 'number'
        ? data.priceRange as PriceRange
        : {min: 0, max: 0}; // Default if not valid
      return {
        categoryId,
        featureSelections: featureSelectionsFromUser,
        sizeId,
        priceRange: priceRange,
        overrideImageUrl: data.overrideImageUrl as string | undefined,
        overrideImageAiHint: data.overrideImageAiHint as string | undefined,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching price from Firestore:", error);
    return null;
  }
}

export function generateItemDescription(
  selections: UserSelections,
  categoriesData: FurnitureCategory[]
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

  let derivedImageUrl = category.imagePlaceholder || defaultImage;
  let derivedImageAiHint = category.imageAiHint || category.name.toLowerCase() || defaultHint;

  // Prioritize feature images. If multiple features have images, the last one processed wins.
  // This could be made more sophisticated (e.g., use image from a specific "primary visual" feature).
  if (selections.featureSelections && (category.features || []).length > 0) {
    for (const feature of (category.features || [])) {
      const selectedOptionIds = selections.featureSelections[feature.id];
      if (selectedOptionIds) {
        const idsArray = Array.isArray(selectedOptionIds) ? selectedOptionIds : [selectedOptionIds];
        for (const optionId of idsArray) {
          const option = (feature.options || []).find(opt => opt.id === optionId);
          if (option?.imagePlaceholder) {
            derivedImageUrl = option.imagePlaceholder;
            derivedImageAiHint = option.imageAiHint || option.label.toLowerCase();
            // Found an image from a feature option, could break or continue to let later selections override.
            // For simplicity, let's allow later features to override.
          }
        }
      }
    }
  }

  // Then prioritize size image if no feature image took precedence and size has an image.
  if (selections.sizeId) {
    const sizeConfig = (category.sizes || []).find(s => s.id === selections.sizeId);
    // Only use size image if no feature image was suitable or if size image is considered "more specific".
    // Current logic: if feature image was found, it's used. Size image acts as a fallback if feature has no image.
    // To make size override feature, this check needs adjustment.
    // For now, let's assume feature images are more specific IF found.
    // If derivedImageUrl is still the category's default, then check size.
    if (derivedImageUrl === (category.imagePlaceholder || defaultImage) && sizeConfig?.imagePlaceholder) {
        derivedImageUrl = sizeConfig.imagePlaceholder;
        derivedImageAiHint = sizeConfig.imageAiHint || sizeConfig.label.toLowerCase();
    }
  }
  
  return { finalImageUrl: derivedImageUrl, finalImageAiHint: derivedImageAiHint };
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
         if (permutations.length === 0 && (feature.options || []).length > 0 && optionSubsets.length > 0 && !optionSubsets.find(s => s.length ===0) ) {
             // This case might be needed if all subsets were non-empty and permutations remained empty.
             // It means we should consider the case without selecting any option for this multi-select feature,
             // effectively skipping it for the next permutation step.
             // However, the current logic with `subset.length > 0 || (feature.options || []).length === 0`
             // might already handle this if `getPowerSet` includes an empty set for non-empty options.
             // Let's assume getPowerSet([a,b]) = [[],[a],[b],[a,b]]. If [a,b] means options are non-empty.
             // If options are empty, subset is [[]]. `subset.length > 0` is false, but `(feature.options || []).length === 0` is true. Correct.
             // If options non-empty, subset can be []. `subset.length > 0` is false. `(feature.options || []).length === 0` is false. This path skipped for empty selection.
             // This seems to mean that an empty selection for a multi-select feature with options is not generated, which might be intended.
             // To always proceed, even if no option is chosen for a multi-select feature:
             // Add a path: permutations = permutations.concat(generateFeaturePermutations(featureIndex + 1, currentSelections));
         } else if (permutations.length === 0 && (feature.options || []).length > 0) {
             // If no permutations were generated (e.g. all subsets were empty, which means options were empty, handled by first if)
             // OR if all subsets led to no further valid permutations.
             // This ensures we at least try to proceed with the existing selections if this feature branch dies out.
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
      return permutations.length > 0 ? permutations : [currentSelections]; // Ensure we return at least the input selections if no new perms
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

        const derivedImage = getFinalImageForSelections(userSelections, categoriesFromFirestore);
        const displayImageUrl = existingPriceEntry?.overrideImageUrl || derivedImage.finalImageUrl;
        const displayImageAiHint = existingPriceEntry?.overrideImageAiHint || derivedImage.finalImageAiHint;

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
          priceRange: (existingPriceEntry?.priceRange && typeof existingPriceEntry.priceRange.min === 'number' && typeof existingPriceEntry.priceRange.max === 'number')
            ? existingPriceEntry.priceRange
            : { min: 0, max: 0 }, // Default if not found or invalid
          description: fullDescription,
          isPriced: !!(existingPriceEntry && existingPriceEntry.priceRange && (existingPriceEntry.priceRange.min > 0 || existingPriceEntry.priceRange.max > 0) ), // Considered priced if range exists and not 0-0
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
  _categoriesFromFirestore: FurnitureCategory[], // Not strictly needed if only saving price, but kept for signature
  overrideImageUrl?: string,
  overrideImageAiHint?: string
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

    if (overrideImageUrl !== undefined) { // Check for undefined to allow clearing
      dataToSave.overrideImageUrl = overrideImageUrl;
      dataToSave.overrideImageAiHint = overrideImageAiHint || ''; // Ensure hint is present or empty string
    }

    await setDoc(priceDocRef, dataToSave, { merge: true });
    return { ...entry, overrideImageUrl, overrideImageAiHint }; // Return the entry with potentially updated image info
  } catch (error) {
    console.error("Error saving price to Firestore:", error);
    return null;
  }
}
