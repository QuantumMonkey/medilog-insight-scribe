
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from "lucide-react";
import { extractTextFromDocument, extractStructuredData } from '@/utils/documentProcessor';

interface UploadDialogProps {
  knownDoctors: string[];
  knownFacilities: string[];
  onUploadComplete: () => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ knownDoctors, knownFacilities, onUploadComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    facility: '',
  });
  
  const { toast } = useToast();
  
  const handleInputChange = (field: string, value: string) => {
    setReportFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setIsUploading(true);
    
    try {
      // Extract text from document
      const extractedText = await extractTextFromDocument(file);
      
      // Extract structured data
      const structuredData = extractStructuredData(extractedText);
      setExtractedData(structuredData);
      
      // Pre-fill form with extracted data if possible
      if (structuredData?.title) {
        handleInputChange('title', structuredData.title);
      }
      if (structuredData?.date) {
        handleInputChange('date', structuredData.date);
      }
      if (structuredData?.doctor) {
        handleInputChange('doctor', structuredData.doctor);
      }
      if (structuredData?.facility) {
        handleInputChange('facility', structuredData.facility);
      }
      
      toast({
        title: "Document processed",
        description: "Data has been extracted from your document.",
      });
    } catch (error) {
      toast({
        title: "Processing error",
        description: "There was an error processing your document.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUpload = () => {
    if (!reportFormData.title || !reportFormData.date) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and date for your report.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    toast({
      title: "Report upload started",
      description: "Your report is being processed.",
    });
    
    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      // Create new report object with form data and extracted data
      const newReport = {
        id: Math.random().toString(36).substring(2, 9),
        title: reportFormData.title,
        date: reportFormData.date,
        doctor: reportFormData.doctor || 'Self',
        facility: reportFormData.facility || 'Self',
        notes: extractedData?.notes || "No notes available.",
        metrics: extractedData?.metrics || [],
        fileUrl: null
      };
      
      // Add to reports (in a real app, would save to database)
      // For now, we're just simulating success
      
      toast({
        title: "Report uploaded successfully",
        description: "Your health report has been added to your records.",
      });
      
      // Reset form and close dialog
      setReportFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        doctor: '',
        facility: '',
      });
      setUploadedFile(null);
      setExtractedData(null);
      setOpenDialog(false);
      setIsUploading(false);
      
      // Notify parent component
      onUploadComplete();
    }, 2000);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpenDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload New Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload Health Report</DialogTitle>
          <DialogDescription>
            Upload your health report document or enter details manually.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="upload">
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            {extractedData && <TabsTrigger value="preview">Extracted Data</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="file-upload">Upload Health Report Document</Label>
              <Input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                disabled={isUploading}
              />
              {uploadedFile && (
                <div className="text-sm text-muted-foreground">
                  Uploaded: {uploadedFile.name}
                </div>
              )}
              {isUploading && <p className="text-center text-sm">Processing document...</p>}
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input 
                  id="report-title" 
                  placeholder="E.g., Annual Physical Examination" 
                  value={reportFormData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-date">Report Date</Label>
                <Input 
                  id="report-date" 
                  type="date"
                  value={reportFormData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doctor-name">Doctor's Name</Label>
                <Select 
                  value={reportFormData.doctor} 
                  onValueChange={(value) => handleInputChange('doctor', value)}
                >
                  <SelectTrigger id="doctor-name">
                    <SelectValue placeholder="Select or enter doctor's name" />
                  </SelectTrigger>
                  <SelectContent>
                    {knownDoctors.map(doctor => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facility">Healthcare Facility</Label>
                <Select 
                  value={reportFormData.facility} 
                  onValueChange={(value) => handleInputChange('facility', value)}
                >
                  <SelectTrigger id="facility">
                    <SelectValue placeholder="Select or enter facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {knownFacilities.map(facility => (
                      <SelectItem key={facility} value={facility}>
                        {facility}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          {extractedData && (
            <TabsContent value="preview" className="space-y-4">
              <h3 className="text-md font-semibold">Extracted Information</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Extracted Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(extractedData)
                    .filter(([key]) => !['metrics', 'notes', 'additionalMetrics', 'diagnosisCodes', 'medications', 'recommendations'].includes(key))
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">
                          {key}
                        </TableCell>
                        <TableCell>
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {extractedData.additionalMetrics && Object.keys(extractedData.additionalMetrics).length > 0 && (
                <>
                  <h3 className="text-md font-semibold mt-4">Health Metrics</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(extractedData.additionalMetrics).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>{value as string}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
              
              {extractedData.diagnosisCodes && extractedData.diagnosisCodes.length > 0 && (
                <>
                  <h3 className="text-md font-semibold mt-4">Diagnosis Codes</h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.diagnosisCodes.map((code: string, index: number) => (
                      <div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded">
                        {code}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {extractedData.medications && extractedData.medications.length > 0 && (
                <>
                  <h3 className="text-md font-semibold mt-4">Medications</h3>
                  <ul className="list-disc pl-5">
                    {extractedData.medications.map((med: string, index: number) => (
                      <li key={index}>{med}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {extractedData.recommendations && extractedData.recommendations.length > 0 && (
                <>
                  <h3 className="text-md font-semibold mt-4">Recommendations</h3>
                  <ul className="list-disc pl-5">
                    {extractedData.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
