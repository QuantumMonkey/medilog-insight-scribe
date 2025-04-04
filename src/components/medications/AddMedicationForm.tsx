
import React from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { Medication } from '@/types/health';

interface AddMedicationFormProps {
  newMedication: Partial<Medication>;
  updateNewMedication: (field: string, value: any) => void;
  handleAddMedication: () => void;
}

const AddMedicationForm = ({ 
  newMedication, 
  updateNewMedication, 
  handleAddMedication 
}: AddMedicationFormProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Enter the details of your new medication.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="medication-name">Medication Name</Label>
            <Input 
              id="medication-name" 
              placeholder="e.g., Lisinopril"
              value={newMedication.name || ''}
              onChange={(e) => updateNewMedication('name', e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input 
              id="dosage" 
              placeholder="e.g., 10mg"
              value={newMedication.dosage || ''}
              onChange={(e) => updateNewMedication('dosage', e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select 
              value={newMedication.frequency || ''}
              onValueChange={(value) => updateNewMedication('frequency', value)}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="condition">For Condition</Label>
            <Input 
              id="condition" 
              placeholder="e.g., High blood pressure"
              value={newMedication.forCondition || ''}
              onChange={(e) => updateNewMedication('forCondition', e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input 
              id="start-date" 
              type="date" 
              value={newMedication.startDate || ''}
              onChange={(e) => updateNewMedication('startDate', e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input 
              id="notes" 
              placeholder="Any additional instructions"
              value={newMedication.notes || ''}
              onChange={(e) => updateNewMedication('notes', e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label className="mb-1">Set Reminder</Label>
            <div className="flex items-center justify-between">
              <span>Daily reminder for this medication</span>
              <Switch 
                checked={newMedication.reminderEnabled || false}
                onCheckedChange={(checked) => updateNewMedication('reminderEnabled', checked)} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => updateNewMedication('reset', {
            isActive: true,
            startDate: new Date().toISOString().split('T')[0]
          })}>Cancel</Button>
          <Button onClick={handleAddMedication}>Add Medication</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationForm;
