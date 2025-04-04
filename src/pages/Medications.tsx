
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleMedications } from '@/data/sampleData';
import { Pill, Clock, Calendar, AlertCircle, Search, Filter, Plus, CheckCircle, XCircle, Bell, Edit, Trash, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Medication } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { exportMedicationToPDF } from '@/services/consultation/consultationExport';

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
    reminderTimes: []
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
      startDate: new Date().toISOString().split('T')[0]
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
      
      // Show dialog asking user if they want to save or print
      setShowPrintDialog(true);
      
      // Store PDF data in component state for later use
      setNewMedication(prev => ({ ...prev, pdfData: pdf, pdfFilename: filename }));
      
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
    // Use the PDF data from state to save the file
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
    // Use the PDF data from state to print
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
    setNewMedication(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Medications</h1>
          <p className="text-muted-foreground">Track your medications and set reminders</p>
        </div>
        
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
                  value={newMedication.frequency || 'daily-once'}
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
              <Button variant="outline" onClick={() => setNewMedication({
                isActive: true,
                startDate: new Date().toISOString().split('T')[0]
              })}>Cancel</Button>
              <Button onClick={handleAddMedication}>Add Medication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          <div className="space-y-4">
            {filteredMedications.length > 0 ? (
              filteredMedications.map(medication => (
                <Card 
                  key={medication.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${selectedMedication?.id === medication.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedMedication(medication)}
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
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">No medications found matching your criteria.</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {selectedMedication && (
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMedication.name}</CardTitle>
                    <CardDescription>
                      {selectedMedication.dosage} • {selectedMedication.frequency}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Medication</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Medication Name</Label>
                            <Input id="edit-name" defaultValue={selectedMedication.name} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-dosage">Dosage</Label>
                            <Input id="edit-dosage" defaultValue={selectedMedication.dosage} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-frequency">Frequency</Label>
                            <Input id="edit-frequency" defaultValue={selectedMedication.frequency} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-condition">For Condition</Label>
                            <Input id="edit-condition" defaultValue={selectedMedication.forCondition} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Input id="edit-notes" defaultValue={selectedMedication.notes} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reminders">Reminders</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Medication</h3>
                        <p className="mt-1 font-medium">{selectedMedication.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Dosage</h3>
                        <p className="mt-1">{selectedMedication.dosage}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Frequency</h3>
                        <p className="mt-1">{selectedMedication.frequency}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">For Condition</h3>
                        <p className="mt-1">{selectedMedication.forCondition}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                        <p className="mt-1">{selectedMedication.startDate}</p>
                      </div>
                      
                      {selectedMedication.endDate && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                          <p className="mt-1">{selectedMedication.endDate}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                      <p className="mt-1 p-3 bg-muted/30 rounded-md">{selectedMedication.notes}</p>
                    </div>
                    
                    <div className="mt-4 p-3 border rounded-md bg-accent/10 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {selectedMedication.isActive ? 
                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">Status: {selectedMedication.isActive ? 'Active' : 'Completed'}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedMedication.isActive 
                              ? 'You are currently taking this medication' 
                              : 'You have completed this medication course'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleStatusToggle}>
                        {selectedMedication.isActive ? 'Mark as Completed' : 'Mark as Active'}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reminders">
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 mr-3 text-health-blue" />
                          <div>
                            <p className="font-medium">Medication Reminders</p>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications to take your medication
                            </p>
                          </div>
                        </div>
                        <Switch checked={selectedMedication.reminderTimes ? selectedMedication.reminderTimes.length > 0 : false} />
                      </div>
                      
                      {selectedMedication.reminderTimes && selectedMedication.reminderTimes.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Reminder Schedule</h3>
                          
                          {selectedMedication.reminderTimes.map((time, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{time}</span>
                              </div>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          ))}
                          
                          <Button variant="outline" className="w-full mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Time
                          </Button>
                        </div>
                      )}
                      
                      <div className="p-4 bg-muted/30 rounded-md flex items-start mt-4">
                        <AlertCircle className="h-5 w-5 mr-3 text-health-blue mt-0.5" />
                        <div>
                          <p className="font-medium">Reminder Tips</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Set reminders at times when you're likely to remember taking your medication, 
                            such as morning routines or meal times. Consistent timing helps maintain optimal 
                            medication levels in your body.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={handlePrintInformation}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Information
                </Button>
                <Button className="w-full sm:w-auto" onClick={handleSetReminder}>Set Reminder</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      
      {/* Print/Save PDF Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>PDF Generated</DialogTitle>
            <DialogDescription>
              Your medication information has been converted to a PDF document. What would you like to do with it?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Button onClick={handleSavePDF} className="w-full">
              Save PDF to Device
            </Button>
            <Button onClick={handlePrintPDF} variant="outline" className="w-full">
              Print Document
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowPrintDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;
