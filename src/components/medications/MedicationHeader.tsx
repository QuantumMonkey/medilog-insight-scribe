
import React from 'react';
import AddMedicationForm from './AddMedicationForm';
import { Medication } from '@/types/health';

interface MedicationHeaderProps {
  newMedication: Partial<Medication>;
  updateNewMedication: (field: string, value: any) => void;
  handleAddMedication: () => void;
}

const MedicationHeader = ({
  newMedication,
  updateNewMedication,
  handleAddMedication
}: MedicationHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Medications</h1>
        <p className="text-muted-foreground">Track your medications and set reminders</p>
      </div>
      
      <AddMedicationForm 
        newMedication={newMedication}
        updateNewMedication={updateNewMedication}
        handleAddMedication={handleAddMedication}
      />
    </div>
  );
};

export default MedicationHeader;
