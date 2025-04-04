
import { useState } from 'react';
import { Medication } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { exportMedicationToPDF } from '@/services/consultation/consultationExport';

export const useMedicationManagement = (initialMedications: Medication[]) => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(
    initialMedications.find(med => med.isActive) || initialMedications[0]
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

  // Helper function to update new medication data
  const updateNewMedication = (field: string, value: any) => {
    if (field === 'reset') {
      setNewMedication(value);
    } else {
      setNewMedication(prev => ({ ...prev, [field]: value }));
    }
  };

  return {
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
  };
};
