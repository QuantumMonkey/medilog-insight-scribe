
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import { Medication } from '@/types/health';

interface MedicationListProps {
  medications: Medication[];
  selectedMedication: Medication | null;
  onSelectMedication: (medication: Medication) => void;
}

const MedicationList = ({ medications, selectedMedication, onSelectMedication }: MedicationListProps) => {
  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No medications found matching your criteria.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map(medication => (
        <Card 
          key={medication.id} 
          className={`cursor-pointer hover:shadow-md transition-all ${selectedMedication?.id === medication.id ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelectMedication(medication)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg mt-0.5 ${medication.isActive ? 'bg-health-purple/10 text-health-purple' : 'bg-muted text-muted-foreground'}`}>
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{medication.name}</h3>
                  <p className="text-sm">{medication.dosage}, {medication.frequency}</p>
                  <p className="text-xs text-muted-foreground mt-1">For: {medication.forCondition}</p>
                </div>
              </div>
              <Badge variant={medication.isActive ? "default" : "outline"} className={medication.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                {medication.isActive ? "Active" : "Completed"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MedicationList;
