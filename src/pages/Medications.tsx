
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleMedications } from '@/data/sampleData';
import { Search, Filter } from "lucide-react";
import { Medication } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { exportMedicationToPDF } from '@/services/consultation/consultationExport';
import MedicationList from '@/components/medications/MedicationList';
import MedicationDetails from '@/components/medications/MedicationDetails';
import AddMedicationForm from '@/components/medications/AddMedicationForm';
import PrintDialog from '@/components/medications/PrintDialog';

const Medications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [medications, setMedications] = useState(sampleMedications);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(
    sampleMedications.find(med => med.isActive) || sampleMedications[0]
  );
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    reminderTimes: [],
    reminderEnabled: false
  });
  const { toast } = useToast();
  
  const handleAddMedication = () => {
    // Validate required fields
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency || !newMedication.forCondition) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new medication with unique id
    const medication: Medication = {
      id: (Math.max(0, ...medications.map(m => parseInt(m.id))) + 1).toString(),
      name: newMedication.name!,
      dosage: newMedication.dosage!,
      frequency: newMedication.frequency!,
      forCondition: newMedication.forCondition!,
      startDate: newMedication.startDate!,
      endDate: newMedication.endDate,
      isActive: true,
      notes: newMedication.notes || "No notes provided.",
      reminderTimes: newMedication.reminderEnabled ? ["8:00 AM"] : []
    };
    
    // Add to medications list
    const updatedMedications = [...medications, medication];
    setMedications(updatedMedications);
    setSelectedMedication(medication);
    
    // Reset new medication form
    setNewMedication({
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      reminderEnabled: false
    });
    
    toast({
      title: "Medication added",
      description: `${medication.name} has been added to your list.`,
    });
  };
  
  const handleStatusToggle = () => {
    if (!selectedMedication) return;
    
    // Update medication status
    const updatedMedications = medications.map(med => 
      med.id === selectedMedication.id 
        ? { ...med, isActive: !med.isActive } 
        : med
    );
    
    const updatedSelectedMedication = {
      ...selectedMedication,
      isActive: !selectedMedication.isActive
    };
    
    setMedications(updatedMedications);
    setSelectedMedication(updatedSelectedMedication);
    
    toast({
      title: updatedSelectedMedication.isActive ? "Medication activated" : "Medication completed",
      description: `${selectedMedication.name} has been ${updatedSelectedMedication.isActive ? 'marked as active' : 'marked as completed'}.`,
    });
  };
  
  const handleSetReminder = () => {
    if (!selectedMedication) return;
    
    const updatedMedication = {
      ...selectedMedication,
      reminderTimes: selectedMedication.reminderTimes?.length 
        ? selectedMedication.reminderTimes 
        : ["8:00 AM"]
    };
    
    const updatedMedications = medications.map(med => 
      med.id === selectedMedication.id ? updatedMedication : med
    );
    
    setMedications(updatedMedications);
    setSelectedMedication(updatedMedication);
    
    toast({
      title: "Reminder set",
      description: `You will receive reminders for ${selectedMedication.name}.`,
    });
  };
  
  const handlePrintInformation = () => {
    if (!selectedMedication) return;
    
    try {
      // Generate PDF
      const { pdf, filename } = exportMedicationToPDF(selectedMedication);
      
      // Store PDF data for later use
      setNewMedication(prev => ({ 
        ...prev, 
        pdfData: pdf, 
        pdfFilename: filename 
      }));
      
      // Show dialog asking user if they want to save or print
      setShowPrintDialog(true);
      
      toast({
        title: "PDF generated",
        description: "Your medication information has been converted to PDF.",
      });
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating the PDF file.",
        variant: "destructive"
      });
    }
  };
  
  const handleSavePDF = () => {
    // Use the PDF data to save the file
    if (newMedication.pdfData) {
      newMedication.pdfData.save(newMedication.pdfFilename);
      setShowPrintDialog(false);
      toast({
        title: "PDF saved",
        description: `File saved as ${newMedication.pdfFilename}`,
      });
    }
  };
  
  const handlePrintPDF = () => {
    // Use the PDF data to print
    if (newMedication.pdfData) {
      newMedication.pdfData.autoPrint();
      newMedication.pdfData.output('dataurlnewwindow');
      setShowPrintDialog(false);
      toast({
        title: "Print requested",
        description: "The document has been sent to your printer.",
      });
    }
  };
  
  // Filter medications based on search and status
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          med.forCondition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && med.isActive) || 
                          (filterStatus === 'inactive' && !med.isActive);
    return matchesSearch && matchesFilter;
  });
  
  // Helper function to update new medication data
  const updateNewMedication = (field: string, value: any) => {
    if (field === 'reset') {
      setNewMedication(value);
    } else {
      setNewMedication(prev => ({ ...prev, [field]: value }));
    }
  };
  
  return (
    <div className="space-y-6">
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
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Medications</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Completed Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
