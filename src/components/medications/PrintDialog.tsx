
import React from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onPrint: () => void;
}

const PrintDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  onPrint 
}: PrintDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>PDF Generated</DialogTitle>
          <DialogDescription>
            Your medication information has been converted to a PDF document. What would you like to do with it?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Button onClick={onSave} className="w-full">
            Save PDF to Device
          </Button>
          <Button onClick={onPrint} variant="outline" className="w-full">
            Print Document
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintDialog;
