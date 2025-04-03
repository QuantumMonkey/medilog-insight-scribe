
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleConsultations } from '@/data/consultationData';
import { FileText, Calendar, User, Building, PlusCircle, Search, Filter, Download, Edit, Trash, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Consultation } from '@/types/consultations';

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeConsultation, setActiveConsultation] = useState(sampleConsultations[0]);
  const { toast } = useToast();
  
  const handleUpload = () => {
    toast({
      title: "Consultation uploaded",
      description: "Your consultation paper has been added to your records.",
    });
    
    // Close dialog would happen here in a real implementation
  };
  
  const categories = ["General", "Cardiology", "Dermatology", "Orthopedics", "Nutrition", "Neurology", "Psychiatry", "Other"];
  
  // Filter consultations based on search term and category
  const filteredConsultations = sampleConsultations.filter(consultation => {
    const matchesSearch = consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          consultation.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultation.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || consultation.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Consultation Papers</h1>
          <p className="text-muted-foreground">Store and manage your medical consultation records</p>
        </div>
        
        <Dialog>
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
                <Label htmlFor="consultation-title">Consultation Title</Label>
                <Input id="consultation-title" placeholder="E.g., Cardiology Follow-up" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="consultation-date">Date</Label>
                  <Input id="consultation-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="consultation-category">Category</Label>
                  <Select>
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
                  <Label htmlFor="doctor-name">Doctor's Name</Label>
                  <Input id="doctor-name" placeholder="Dr. Jane Smith" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facility">Healthcare Facility</Label>
                  <Input id="facility" placeholder="City Hospital" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the consultation" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Detailed notes about the consultation" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file-upload">Upload Document</Label>
                <Input id="file-upload" type="file" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleUpload}>Upload Consultation</Button>
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
                        <h3 className="font-medium leading-tight">{consultation.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span>{consultation.doctor}</span>
                        </div>
                        <Badge className="mt-2" variant="outline">{consultation.category}</Badge>
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
                    <CardTitle>{activeConsultation.title}</CardTitle>
                    <CardDescription>
                      {activeConsultation.date} • {activeConsultation.facility}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {activeConsultation.fileUrl && (
                      <Button variant="outline" size="icon" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Delete">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                {activeConsultation.fileUrl && (
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                    <div className="text-muted-foreground mb-2">Consultation document preview</div>
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <Button variant="outline" className="mt-4">
                      <Eye className="mr-2 h-4 w-4" />
                      View Document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;
