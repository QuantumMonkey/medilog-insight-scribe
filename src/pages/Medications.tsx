
import React, { useState } from 'react';
import { sampleMedications } from '@/data/sampleData';
import { Medication } from '@/types/health';
import { useMedicationManagement } from '@/hooks/useMedicationManagement';
import MedicationList from '@/components/medications/MedicationList';
import MedicationDetails from '@/components/medications/MedicationDetails';
import PrintDialog from '@/components/medications/PrintDialog';
import MedicationSearch from '@/components/medications/MedicationSearch';
import MedicationHeader from '@/components/medications/MedicationHeader';

const Medications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const {
    medications,
    selectedMedication,
    showPrintDialog,
    newMedication,
    setSelectedMedication,
    setShowPrintDialog,
    handleAddMedication,
    handleStatusToggle,
    handleSetReminder,
    handlePrintInformation,
    handleSavePDF,
    handlePrintPDF,
    updateNewMedication
  } = useMedicationManagement(sampleMedications);
  
  // Filter medications based on search and status
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          med.forCondition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && med.isActive) || 
                          (filterStatus === 'inactive' && !med.isActive);
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="space-y-6">
      <MedicationHeader 
        newMedication={newMedication}
        updateNewMedication={updateNewMedication}
        handleAddMedication={handleAddMedication}
      />
      
      <MedicationSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <MedicationList 
            medications={filteredMedications}
            selectedMedication={selectedMedication}
            onSelectMedication={setSelectedMedication}
          />
        </div>
        
        {selectedMedication && (
          <div className="md:col-span-2">
            <MedicationDetails 
              medication={selectedMedication}
              onStatusToggle={handleStatusToggle}
              onSetReminder={handleSetReminder}
              onPrintInformation={handlePrintInformation}
            />
          </div>
        )}
      </div>
      
      {/* Print/Save PDF Dialog */}
      <PrintDialog 
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        onSave={handleSavePDF}
        onPrint={handlePrintPDF}
      />
    </div>
  );
};

export default Medications;
