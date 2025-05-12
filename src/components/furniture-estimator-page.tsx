"use client";

import { useState, useMemo, useCallback } from 'react';
import type { UserSelections, PriceRange, FurnitureCategory as FurnitureCategoryType, Step, EstimationRecord } from '@/lib/definitions';
import { FURNITURE_CATEGORIES, getEstimatedPrice, generateItemDescription } from '@/lib/furniture-data';
import CategorySelector from '@/components/furniture-estimator/category-selector';
import FeatureSelector from '@/components/furniture-estimator/feature-selector';
import SizeSelector from '@/components/furniture-estimator/size-selector';
import PriceDisplay from '@/components/furniture-estimator/price-display';
import StepIndicator from '@/components/furniture-estimator/step-indicator';
import Header from '@/components/layout/header'; 
import { useEstimationStorage } from '@/hooks/use-estimation-storage';
import SaveEstimationDialog from '@/components/history/save-estimation-dialog';


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


  const currentCategoryData = useMemo(() => {
    if (!selections.categoryId) return null;
    return FURNITURE_CATEGORIES.find(c => c.id === selections.categoryId) || null;
  }, [selections.categoryId]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelections({
      categoryId,
      featureSelections: {}, 
      sizeId: null,          
    });
    const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      if (category.features.length === 0) {
        setStep('size'); 
      } else {
        setStep('features');
      }
    }
  }, []);

  const handleFeatureSelect = useCallback((featureId: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      featureSelections: {
        ...prev.featureSelections,
        [featureId]: optionId,
      },
    }));
  }, []);

  const handleProceedToSize = useCallback(() => {
    setStep('size');
  }, []);
  
  const handleBackToCategory = useCallback(() => {
    setSelections(prev => ({...initialSelections, categoryId: null})); 
    setStep('category');
  }, []);

  const handleBackToFeatures = useCallback(() => {
     setSelections(prev => ({...prev, sizeId: null})); 
     setStep('features');
  }, []);

  const handleSizeSelect = useCallback((sizeId: string) => {
    setSelections(prev => ({ ...prev, sizeId }));
  }, []);

  const handleGetEstimate = useCallback(() => {
    if (!selections.categoryId || !selections.sizeId) return;

    const priceEntry = getEstimatedPrice(selections.categoryId, selections.featureSelections, selections.sizeId);
    const description = generateItemDescription(selections, FURNITURE_CATEGORIES);
    
    const estimationResult = {
        priceRange: priceEntry?.priceRange || null, 
        description,
        selections: { ...selections } // Capture the current selections
    };
    setCurrentEstimationData(estimationResult);
    addHistoryItem(estimationResult); // Add to history
    setStep('result');
  }, [selections, addHistoryItem]);

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
    switch (step) {
      case 'category':
        return <CategorySelector categories={FURNITURE_CATEGORIES} onSelectCategory={handleCategorySelect} />;
      case 'features':
        if (!currentCategoryData) return <p>Error: Category not found.</p>;
        return (
          <FeatureSelector
            features={currentCategoryData.features}
            currentSelections={selections.featureSelections}
            onFeatureSelect={handleFeatureSelect}
            onNext={handleProceedToSize}
            onBack={handleBackToCategory}
            categoryName={currentCategoryData.name}
            selectedOptionsImageURLs={currentEstimationData?.selections.featureSelections || {}}
            categoryImageURL={currentCategoryData.imagePlaceholder}
            categoryImageAiHint={currentCategoryData.imageAiHint}
            allCategories={FURNITURE_CATEGORIES}
          />
        );
      case 'size':
        if (!currentCategoryData) return <p>Error: Category not found.</p>;
        return (
          <SizeSelector
            sizes={currentCategoryData.sizes}
            currentSelection={selections.sizeId}
            onSizeSelect={handleSizeSelect}
            onGetEstimate={handleGetEstimate}
            onBack={currentCategoryData.features.length > 0 ? handleBackToFeatures : handleBackToCategory}
            categoryName={currentCategoryData.name}
            categoryImageURL={currentCategoryData.imagePlaceholder}
            categoryImageAiHint={currentCategoryData.imageAiHint}
            currentSelections={selections}
            allCategories={FURNITURE_CATEGORIES}
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
            allCategories={FURNITURE_CATEGORIES}
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
