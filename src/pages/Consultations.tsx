
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, User, Building, PlusCircle, Search, Filter, Download, Edit, Trash, Eye, Lock, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Consultation } from '@/types/consultations';
import { getAllConsultations, addConsultation, updateConsultation, deleteConsultation, filterConsultations } from '@/services/consultationService';
import { processConsultationDocument } from '@/utils/documentProcessor';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [showExtractedData, setShowExtractedData] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    facility: '',
    category: 'General',
    description: '',
    notes: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const { toast } = useToast();
  
  const categories = ["General", "Cardiology", "Dermatology", "Orthopedics", "Nutrition", "Neurology", "Psychiatry", "Other"];
  
  useEffect(() => {
    // Load all consultations on component mount
    const loadedConsultations = getAllConsultations();
    setConsultations(loadedConsultations);
    
    // Set active consultation if available
    if (loadedConsultations.length > 0 && !activeConsultation) {
      setActiveConsultation(loadedConsultations[0]);
    }
  }, []);
  
  // Filter consultations based on search term and category
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          consultation.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultation.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || consultation.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewConsultation(prev => ({
      ...prev,
      [id.replace('consultation-', '')]: value
    }));
  };
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setNewConsultation(prev => ({
      ...prev,
      category: value
    }));
  };
  
  // Handle consultation upload
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      
      if (!newConsultation.title || !newConsultation.date) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }
      
      let consultationData: Partial<Consultation> = {
        ...newConsultation,
        status: 'pending',
        isEncrypted: true,
      };
      
      // Process document if uploaded
      if (uploadedFile) {
        consultationData = await processConsultationDocument(uploadedFile, consultationData);
      }
      
      // Add the consultation
      const addedConsultation = addConsultation(consultationData as Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>);
      
      // Update state
      setConsultations(prev => [...prev, addedConsultation]);
      setActiveConsultation(addedConsultation);
      
      // Reset form
      setNewConsultation({
        title: '',
        date: new Date().toISOString().split('T')[0],
        doctor: '',
        facility: '',
        category: 'General',
        description: '',
        notes: '',
      });
      setUploadedFile(null);
      setUploadOpen(false);
      
      toast({
        title: "Consultation uploaded",
        description: "Your consultation paper has been added to your records.",
      });
    } catch (error) {
      console.error("Error uploading consultation:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your consultation.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle consultation deletion
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this consultation?")) {
      const deleted = deleteConsultation(id);
      
      if (deleted) {
        const updatedConsultations = getAllConsultations();
        setConsultations(updatedConsultations);
        
        if (activeConsultation?.id === id) {
          setActiveConsultation(updatedConsultations.length > 0 ? updatedConsultations[0] : null);
        }
        
        toast({
          title: "Consultation deleted",
          description: "The consultation has been removed from your records.",
        });
      }
    }
  };
  
  // Handle downloading the consultation document
  const handleDownload = (consultation: Consultation) => {
    if (consultation.fileUrl) {
      // In a real app, this would download the actual file
      // For this demo, we'll just show a toast
      toast({
        title: "Download started",
        description: "Your consultation document is being downloaded.",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Consultation Papers</h1>
          <p className="text-muted-foreground">Store and manage your medical consultation records</p>
        </div>
        
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Upload Consultation Paper</DialogTitle>
              <DialogDescription>
                Upload your consultation document or enter details manually.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="consultation-title">Consultation Title*</Label>
                <Input 
                  id="consultation-title" 
                  placeholder="E.g., Cardiology Follow-up" 
                  value={newConsultation.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="consultation-date">Date*</Label>
                  <Input 
                    id="consultation-date" 
                    type="date" 
                    value={newConsultation.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="consultation-category">Category*</Label>
                  <Select 
                    value={newConsultation.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="consultation-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="consultation-doctor">Doctor's Name</Label>
                  <Input 
                    id="consultation-doctor" 
                    placeholder="Dr. Jane Smith" 
                    value={newConsultation.doctor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="consultation-facility">Healthcare Facility</Label>
                  <Input 
                    id="consultation-facility" 
                    placeholder="City Hospital" 
                    value={newConsultation.facility}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="consultation-description">Description</Label>
                <Input 
                  id="consultation-description" 
                  placeholder="Brief description of the consultation" 
                  value={newConsultation.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="consultation-notes">Notes</Label>
                <Textarea 
                  id="consultation-notes" 
                  placeholder="Detailed notes about the consultation" 
                  rows={3} 
                  value={newConsultation.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file-upload">Upload Document (PDF, Image, or Text)</Label>
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                />
                <p className="text-xs text-muted-foreground">
                  Document will be analyzed to extract medical information automatically.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="encrypt-data" defaultChecked disabled />
                <label
                  htmlFor="encrypt-data"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Encrypt sensitive data (always enabled for medical records)
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upload Consultation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search consultations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="space-y-4">
            {filteredConsultations.length > 0 ? (
              filteredConsultations.map(consultation => (
                <Card 
                  key={consultation.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${activeConsultation?.id === consultation.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveConsultation(consultation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium leading-tight">{consultation.title}</h3>
                          {consultation.isEncrypted && (
                            <Lock className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span>{consultation.doctor}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{consultation.category}</Badge>
                          {consultation.status === 'processed' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" /> Processed
                            </Badge>
                          )}
                          {consultation.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing
                            </Badge>
                          )}
                          {consultation.status === 'error' && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Error
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">No consultations found matching your criteria.</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {activeConsultation && (
          <div className="col-span-1 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {activeConsultation.title}
                      {activeConsultation.isEncrypted && (
                        <Lock className="h-4 w-4 text-green-500" title="Encrypted" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {activeConsultation.date} • {activeConsultation.facility}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {activeConsultation.fileUrl && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Download"
                        onClick={() => handleDownload(activeConsultation)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Delete"
                      onClick={() => handleDelete(activeConsultation.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="document" disabled={!activeConsultation.fileUrl}>
                      Document
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                      <p className="mt-1">{activeConsultation.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Doctor</h3>
                        <p className="mt-1">{activeConsultation.doctor}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Facility</h3>
                        <p className="mt-1">{activeConsultation.facility}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                        <p className="mt-1">{activeConsultation.date}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                        <p className="mt-1">{activeConsultation.category}</p>
                      </div>
                    </div>
                    
                    {activeConsultation.notes && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                        <p className="mt-1 whitespace-pre-line">{activeConsultation.notes}</p>
                      </div>
                    )}
                    
                    {activeConsultation.extractedData && (
                      <Collapsible 
                        open={showExtractedData} 
                        onOpenChange={setShowExtractedData}
                        className="border rounded-md p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Extracted Medical Data</h3>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {showExtractedData ? "Hide" : "Show"} details
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        
                        <CollapsibleContent className="mt-4 space-y-3">
                          {activeConsultation.extractedData.diagnosisCodes && 
                           activeConsultation.extractedData.diagnosisCodes.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground">Diagnosis Codes</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {activeConsultation.extractedData.diagnosisCodes.map((code, i) => (
                                  <Badge key={i} variant="outline">{code}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {activeConsultation.extractedData.medications && 
                           activeConsultation.extractedData.medications.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground">Medications</h4>
                              <ul className="mt-1 space-y-1">
                                {activeConsultation.extractedData.medications.map((med, i) => (
                                  <li key={i}>{med}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {activeConsultation.extractedData.followUpDate && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground">Follow-up Date</h4>
                              <p className="mt-1">{activeConsultation.extractedData.followUpDate}</p>
                            </div>
                          )}
                          
                          {activeConsultation.extractedData.recommendations && 
                           activeConsultation.extractedData.recommendations.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground">Recommendations</h4>
                              <ul className="mt-1 space-y-1">
                                {activeConsultation.extractedData.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="document">
                    {activeConsultation.fileUrl ? (
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                        <div className="text-muted-foreground mb-2">Consultation document preview</div>
                        <FileText className="h-16 w-16 text-muted-foreground" />
                        
                        {activeConsultation.documentContent && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-md w-full max-h-60 overflow-y-auto text-sm">
                            <pre className="whitespace-pre-wrap font-sans">{activeConsultation.documentContent}</pre>
                          </div>
                        )}
                        
                        <Button variant="outline" className="mt-4">
                          <Eye className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        No document available for this consultation.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;
