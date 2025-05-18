
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { DisplayablePriceEntry } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadCloud } from 'lucide-react';
import NextImage from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface PriceCombinationImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    originalEntry: DisplayablePriceEntry,
    newOverrideImageUrl?: string,
    newOverrideImageAiHint?: string
  ) => void;
  combination: DisplayablePriceEntry;
}

const fileToDataUri = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const DEFAULT_IMAGE_HINT_MAX_WORDS = 2;

export default function PriceCombinationImageDialog({
  isOpen,
  onClose,
  onSubmit,
  combination,
}: PriceCombinationImageDialogProps) {
  const { toast } = useToast();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(combination.overrideImageUrl || combination.imageUrl);
  const [imageAiHint, setImageAiHint] = useState(combination.overrideImageAiHint || combination.imageAiHint || `${combination.categoryName} ${combination.sizeLabel}`.toLowerCase().split(" ").slice(0,DEFAULT_IMAGE_HINT_MAX_WORDS).join(" "));

  useEffect(() => {
    if (isOpen) {
      setImagePreview(combination.overrideImageUrl || combination.imageUrl);
      setImageAiHint(combination.overrideImageAiHint || combination.imageAiHint || `${combination.categoryName} ${combination.sizeLabel}`.toLowerCase().split(" ").slice(0,DEFAULT_IMAGE_HINT_MAX_WORDS).join(" "));
      setSelectedImageFile(null);
    }
  }, [isOpen, combination]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedImageFile) {
      objectUrl = URL.createObjectURL(selectedImageFile);
      setImagePreview(objectUrl);
    } else if (combination.overrideImageUrl) {
      setImagePreview(combination.overrideImageUrl); // Keep existing override if no new file
    } else {
      setImagePreview(combination.imageUrl); // Fallback to derived if no override and no new file
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedImageFile, combination.overrideImageUrl, combination.imageUrl]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 1024 * 1024) { // 1MB limit for Data URI
        toast({
          title: "Image Too Large",
          description: "Please select an image smaller than 1MB for Data URI storage.",
          variant: "destructive",
        });
        setSelectedImageFile(null);
        event.target.value = ""; 
        return;
      }
      setSelectedImageFile(file);
    } else {
      setSelectedImageFile(null);
    }
  };

  const handleFullSubmit = async () => {
    let finalImageOverrideUrl: string | undefined = combination.overrideImageUrl;
    let finalImageAiHint: string | undefined = imageAiHint.trim();

    if (selectedImageFile) {
      try {
        const dataUri = await fileToDataUri(selectedImageFile);
        finalImageOverrideUrl = dataUri;
      } catch (error) {
        console.error("Error converting file to Data URI:", error);
        toast({ title: "Image Processing Failed", description: "Could not process new image. Previous override (if any) will be kept.", variant: "destructive" });
        // If conversion fails, keep existing override or let it be undefined
      }
    }
    
    // If user typed nothing, but there was a default, use default. Otherwise, it's empty.
    if (!finalImageAiHint && (combination.overrideImageAiHint || combination.imageAiHint)) {
        finalImageAiHint = combination.overrideImageAiHint || combination.imageAiHint || `${combination.categoryName} ${combination.sizeLabel}`.toLowerCase().split(" ").slice(0,DEFAULT_IMAGE_HINT_MAX_WORDS).join(" ");
    }


    onSubmit(combination, finalImageOverrideUrl, finalImageAiHint);
    onClose();
  };
  
  const handleClearImage = () => {
    setSelectedImageFile(null);
    setImagePreview(combination.imageUrl); // Revert preview to derived image
    // When submitted, this will effectively remove the override from Firestore
    // by passing undefined for finalImageOverrideUrl to onSubmit
    toast({ title: "Override Image Cleared", description: "The specific image for this combination will be removed upon saving. The default derived image will be used." });
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Image for Combination</DialogTitle>
          <DialogDescription>
            Upload a specific image for: <br/> 
            <span className="font-semibold">{combination.categoryName} - {combination.featureDescription} - {combination.sizeLabel}</span>.
            <br/>This image will override the default. Max 1MB.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-150px)] pr-6">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comboImage">Combination Image (Max 1MB)</Label>
              {imagePreview && (
                <div className="mt-2 relative w-full aspect-[4/3] rounded-md border overflow-hidden bg-muted">
                  <NextImage src={imagePreview} alt="Combination preview" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => document.getElementById('comboImageUpload')?.click()} className="flex-1">
                  <UploadCloud className="mr-2 h-4 w-4" /> {selectedImageFile ? "Change Image" : "Upload Image"}
                </Button>
                { (selectedImageFile || combination.overrideImageUrl) && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleClearImage}>
                        Clear Override
                    </Button>
                )}
              </div>
              <Input
                id="comboImageUpload"
                type="file"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">Upload PNG, JPG, GIF, WEBP. Max 1MB (stored as Data URI).</p>
            </div>
            <div>
              <Label htmlFor="comboImageAiHint">Image AI Hint (max {DEFAULT_IMAGE_HINT_MAX_WORDS} words)</Label>
              <Input 
                id="comboImageAiHint" 
                value={imageAiHint}
                onChange={(e) => setImageAiHint(e.target.value)}
                placeholder="e.g., elegant sofa" 
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleFullSubmit}>Save Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
