
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { UserSelections, PriceRange, FurnitureCategory as FurnitureCategoryType, Step } from '@/lib/definitions';
import { getEstimatedPrice, generateItemDescription, getFirebaseCategories, getFinalImageForSelections } from '@/lib/furniture-data';
import CategorySelector from '@/components/furniture-estimator/category-selector';
import FeatureSelector from '@/components/furniture-estimator/feature-selector';
import SizeSelector from '@/components/furniture-estimator/size-selector';
import PriceDisplay from '@/components/furniture-estimator/price-display';
import StepIndicator from '@/components/furniture-estimator/step-indicator';
import Header from '@/components/layout/header'; 
import { useEstimationStorage } from '@/hooks/use-estimation-storage';
import SaveEstimationDialog from '@/components/history/save-estimation-dialog';
import { Loader2 } from 'lucide-react';

const initialSelections: UserSelections = {
  categoryId: null,
  featureSelections: {},
  sizeId: null,
};

export default function FurnitureEstimatorPage() {
  const [step, setStep] = useState<Step>('category');
  const [selections, setSelections] = useState<UserSelections>(initialSelections);
  const [currentEstimationData, setCurrentEstimationData] = useState<{priceRange: PriceRange | null, description: string, selections: UserSelections} | null>(null);
  
  const { addHistoryItem, addSavedEstimate } = useEstimationStorage();
  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);

  const [liveCategories, setLiveCategories] = useState<FurnitureCategoryType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      const fetchedCategories = await getFirebaseCategories();
      setLiveCategories(fetchedCategories);
      setIsLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  const currentCategoryData = useMemo(() => {
    if (!selections.categoryId || liveCategories.length === 0) return null;
    return liveCategories.find(c => c.id === selections.categoryId) || null;
  }, [selections.categoryId, liveCategories]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelections({ 
      categoryId,
      featureSelections: {}, 
      sizeId: null,          
    });
    const category = liveCategories.find(c => c.id === categoryId);
    if (category) {
      if (!category.features || category.features.length === 0) { // Check if features is undefined or empty
        setStep('size'); 
      } else {
        setStep('features');
      }
    }
  }, [liveCategories]);

  const handleFeatureSelect = useCallback((featureId: string, optionId: string, isSelected?: boolean) => {
    const featureConfig = currentCategoryData?.features.find(f => f.id === featureId);
    if (!featureConfig) return;

    setSelections(prev => {
      const newFeatureSelections = { ...prev.featureSelections };
      if (featureConfig.selectionType === 'multiple') {
        const currentSelectionForFeature = prev.featureSelections[featureId];
        let newSelectionArray: string[];

        if (Array.isArray(currentSelectionForFeature)) {
          newSelectionArray = [...currentSelectionForFeature];
        } else if (typeof currentSelectionForFeature === 'string' && currentSelectionForFeature) {
          newSelectionArray = [currentSelectionForFeature]; 
        }
        else {
          newSelectionArray = [];
        }

        if (isSelected) { 
          if (!newSelectionArray.includes(optionId)) {
            newSelectionArray.push(optionId);
          }
        } else { 
          newSelectionArray = newSelectionArray.filter(id => id !== optionId);
        }
        // Store as array, even if empty, to distinguish from not-set or single-select string
        newFeatureSelections[featureId] = newSelectionArray; 
      } else { 
        newFeatureSelections[featureId] = optionId;
      }
      return { ...prev, featureSelections: newFeatureSelections };
    });
  }, [currentCategoryData]);

  const handleProceedToSize = useCallback(() => {
    setStep('size');
  }, []);
  
  const handleBackToCategory = useCallback(() => {
    setSelections(initialSelections); 
    setStep('category');
  }, []);

  const handleBackToFeatures = useCallback(() => {
     setSelections(prev => ({...prev, sizeId: null})); 
     if (!currentCategoryData?.features || currentCategoryData.features.length === 0) {
        handleBackToCategory();
     } else {
        setStep('features');
     }
  }, [currentCategoryData, handleBackToCategory]);

  const handleSizeSelect = useCallback((sizeId: string) => {
    setSelections(prev => ({ ...prev, sizeId }));
  }, []);

  const handleGetEstimate = useCallback(() => {
    if (!selections.categoryId || !selections.sizeId || !currentCategoryData || liveCategories.length === 0) return;

    const allRequiredFeaturesSelected = (currentCategoryData.features || []).every(f => {
        const selection = selections.featureSelections[f.id];
        if (f.selectionType === 'multiple') {
            return f.options.length === 0 || (Array.isArray(selection) && selection.length > 0);
        }
        return !!selection; // For single select, a selection must exist
    });

    if (!allRequiredFeaturesSelected && (currentCategoryData.features || []).length > 0) {
        console.warn("Not all required features are selected.");
        // Optionally, show a toast message to the user.
        return;
    }
    // Pass liveCategories to getEstimatedPrice
    const priceEntry = getEstimatedPrice(selections.categoryId, selections.featureSelections, selections.sizeId, liveCategories);
    // Pass liveCategories to generateItemDescription
    const description = generateItemDescription(selections, liveCategories);
    
    const estimationResult = {
        priceRange: priceEntry?.priceRange || null, 
        description,
        selections: { ...selections } 
    };
    setCurrentEstimationData(estimationResult);
    addHistoryItem(estimationResult); 
    setStep('result');
  }, [selections, addHistoryItem, currentCategoryData, liveCategories]);

  const handleStartOver = useCallback(() => {
    setSelections(initialSelections);
    setCurrentEstimationData(null);
    setStep('category');
  }, []);

  const handleOpenSaveDialog = useCallback(() => {
    if (currentEstimationData) {
      setIsSaveDialogVisible(true);
    }
  }, [currentEstimationData]);

  const handleSaveEstimate = useCallback((name?: string) => {
    if (currentEstimationData) {
      addSavedEstimate(currentEstimationData, name);
    }
    setIsSaveDialogVisible(false);
  }, [currentEstimationData, addSavedEstimate]);


  const renderStepContent = () => {
    if (isLoadingCategories && step === 'category') {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading categories from Firestore...</p>
        </div>
      );
    }
    if (liveCategories.length === 0 && step === 'category' && !isLoadingCategories) {
        return (
            <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No furniture categories found in Firestore.</p>
                <p className="text-sm text-muted-foreground mt-2">Please add categories in the admin panel.</p>
            </div>
        );
    }


    switch (step) {
      case 'category':
        return <CategorySelector categories={liveCategories} onSelectCategory={handleCategorySelect} />;
      case 'features':
        if (!currentCategoryData) return <p>Error: Category data not loaded or not found.</p>;
        return (
          <FeatureSelector
            features={currentCategoryData.features || []}
            currentSelections={selections.featureSelections}
            onFeatureSelect={handleFeatureSelect}
            onNext={handleProceedToSize}
            onBack={handleBackToCategory}
            categoryName={currentCategoryData.name}
            categoryImageURL={currentCategoryData.imagePlaceholder}
            categoryImageAiHint={currentCategoryData.imageAiHint}
            allCategories={liveCategories} 
          />
        );
      case 'size':
        if (!currentCategoryData) return <p>Error: Category data not loaded or not found.</p>;
        return (
          <SizeSelector
            sizes={currentCategoryData.sizes || []}
            currentSelection={selections.sizeId}
            onSizeSelect={handleSizeSelect}
            onGetEstimate={handleGetEstimate}
            onBack={handleBackToFeatures}
            categoryName={currentCategoryData.name}
            categoryImageURL={currentCategoryData.imagePlaceholder}
            categoryImageAiHint={currentCategoryData.imageAiHint}
          />
        );
      case 'result':
        if (!currentEstimationData) return <p>Loading results...</p>;
        return (
          <PriceDisplay
            priceRange={currentEstimationData.priceRange}
            itemName={currentEstimationData.description}
            onStartOver={handleStartOver}
            onSave={handleOpenSaveDialog}
            currentSelections={currentEstimationData.selections}
            allCategories={liveCategories} // Pass liveCategories
          />
        );
      default:
        return <p>Unknown step.</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <StepIndicator currentStep={step} />
        <div className="mt-8">
          {renderStepContent()}
        </div>
      </div>
      {currentEstimationData && (
        <SaveEstimationDialog
          isOpen={isSaveDialogVisible}
          onClose={() => setIsSaveDialogVisible(false)}
          onSave={handleSaveEstimate}
          defaultName={currentEstimationData.description}
        />
      )}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} FurnitureFind. All rights reserved.
      </footer>
    </div>
  );
}
