
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { UserSelections, PriceRange, FurnitureCategory as FurnitureCategoryType, Step, PriceDataEntry } from '@/lib/definitions';
import { getEstimatedPrice, generateItemDescription, getFirebaseCategories } from '@/lib/furniture-data';
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

// Updated state structure for currentEstimationData
interface CurrentEstimationData {
  priceRange: PriceRange | null;
  description: string;
  selections: UserSelections;
  overrideImageUrl?: string;
  overrideImageAiHint?: string;
}

export default function FurnitureEstimatorPage() {
  const [step, setStep] = useState<Step>('category');
  const [selections, setSelections] = useState<UserSelections>(initialSelections);
  const [currentEstimationData, setCurrentEstimationData] = useState<CurrentEstimationData | null>(null);
  
  const { addHistoryItem, addSavedEstimate } = useEstimationStorage();
  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);

  const [liveCategories, setLiveCategories] = useState<FurnitureCategoryType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

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
      if (!category.features || category.features.length === 0) { 
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

  const handleGetEstimate = useCallback(async () => {
    if (!selections.categoryId || !selections.sizeId || !currentCategoryData || liveCategories.length === 0) return;
    
    setIsLoadingPrice(true);

    const allRequiredFeaturesSelected = (currentCategoryData.features || []).every(f => {
        const selection = selections.featureSelections[f.id];
        if (f.selectionType === 'multiple') {
            return (f.options || []).length === 0 || (Array.isArray(selection) && selection.length > 0);
        }
        return !!selection; 
    });

    if (!allRequiredFeaturesSelected && (currentCategoryData.features || []).length > 0) {
        console.warn("Not all required features are selected.");
        setIsLoadingPrice(false); 
        return;
    }
    
    const priceEntry: PriceDataEntry | null = await getEstimatedPrice(selections.categoryId, selections.featureSelections, selections.sizeId, liveCategories);
    const description = generateItemDescription(selections, liveCategories);
    
    const estimationResult: CurrentEstimationData = {
        priceRange: priceEntry?.priceRange || null, 
        description,
        selections: { ...selections },
        overrideImageUrl: priceEntry?.overrideImageUrl, // Store override image details
        overrideImageAiHint: priceEntry?.overrideImageAiHint,
    };
    setCurrentEstimationData(estimationResult);
    // For history, we save the core estimation data, not necessarily the override image details 
    // unless history items themselves need to store them. For simplicity, keeping history as is for now.
    addHistoryItem({
        priceRange: estimationResult.priceRange,
        description: estimationResult.description,
        selections: estimationResult.selections,
    }); 
    setIsLoadingPrice(false); 
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
      // When saving, we save the core data. If saved items later need to show override images,
      // the EstimationRecord definition and rendering would need adjustment.
      // For now, saved items will use derived images like history items.
      addSavedEstimate({
        selections: currentEstimationData.selections,
        description: currentEstimationData.description,
        priceRange: currentEstimationData.priceRange,
      }, name);
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

    if (isLoadingPrice && (step === 'size' || step === 'features')) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Getting price estimate...</p>
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
        if (isLoadingPrice || !currentEstimationData) {
             return (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading results...</p>
                </div>
            );
        }
        return (
          <PriceDisplay
            priceRange={currentEstimationData.priceRange}
            itemName={currentEstimationData.description}
            onStartOver={handleStartOver}
            onSave={handleOpenSaveDialog}
            currentSelections={currentEstimationData.selections}
            allCategories={liveCategories}
            overrideImageUrl={currentEstimationData.overrideImageUrl} // Pass override image
            overrideImageAiHint={currentEstimationData.overrideImageAiHint} // Pass override hint
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
