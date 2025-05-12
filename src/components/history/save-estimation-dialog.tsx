"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveEstimationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name?: string) => void;
  defaultName?: string;
}

export default function SaveEstimationDialog({
  isOpen,
  onClose,
  onSave,
  defaultName = "",
}: SaveEstimationDialogProps) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
    }
  }, [isOpen, defaultName]);

  const handleSave = () => {
    onSave(name.trim() || defaultName); // Use trimmed name or default if empty
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Estimate</DialogTitle>
          <DialogDescription>
            Optionally give this estimate a name for easier identification later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimate-name" className="text-right">
              Name
            </Label>
            <Input
              id="estimate-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Living Room Sofa Setup"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
