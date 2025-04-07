
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sampleReports } from '@/data/sampleData';
import { FileText, Calendar, User, Building, PlusCircle, Search, Filter, Download, Edit, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { extractTextFromDocument, extractStructuredData } from '@/utils/documentProcessor';

const HealthReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReport, setActiveReport] = useState(sampleReports[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [knownDoctors, setKnownDoctors] = useState<string[]>([]);
  const [knownFacilities, setKnownFacilities] = useState<string[]>([]);
  const [reportFormData, setReportFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    facility: '',
  });
  
  const { toast } = useToast();
  
  // Extract known doctors and facilities from existing reports
  useEffect(() => {
    const doctors = Array.from(new Set(sampleReports.map(report => report.doctor)));
    const facilities = Array.from(new Set(sampleReports.map(report => report.facility)));
    
    setKnownDoctors(['Self', ...doctors]);
    setKnownFacilities(['Self', ...facilities]);
  }, []);
  
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
      if (structuredData.title) {
        handleInputChange('title', structuredData.title);
      }
      if (structuredData.date) {
        handleInputChange('date', structuredData.date);
      }
      if (structuredData.doctor) {
        handleInputChange('doctor', structuredData.doctor);
      }
      if (structuredData.facility) {
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
        id: (Math.max(0, ...sampleReports.map(r => parseInt(r.id))) + 1).toString(),
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
    }, 2000);
  };
  
  const filteredReports = sampleReports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Health Reports</h1>
          <p className="text-muted-foreground">Upload and manage your health reports</p>
        </div>
        
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
                        .filter(([key]) => !['metrics', 'notes'].includes(key))
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
                  
                  {extractedData.metrics && extractedData.metrics.length > 0 && (
                    <>
                      <h3 className="text-md font-semibold mt-4">Health Metrics</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metric</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Normal Range</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {extractedData.metrics.map((metric: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{metric.name}</TableCell>
                              <TableCell>{metric.value}</TableCell>
                              <TableCell>{metric.unit}</TableCell>
                              <TableCell>
                                {metric.normalRange 
                                  ? `${metric.normalRange.min} - ${metric.normalRange.max} ${metric.unit}`
                                  : 'Not specified'
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports by title, doctor, or facility..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <Card 
                  key={report.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${activeReport.id === report.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveReport(report)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium leading-tight">{report.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{report.date}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span>{report.doctor}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">No reports found matching your search.</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {activeReport && (
          <div className="col-span-1 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{activeReport.title}</CardTitle>
                    <CardDescription>
                      {activeReport.date} • {activeReport.facility}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="metrics">
                  <TabsList>
                    <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
                    <TabsTrigger value="details">Report Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {activeReport.metrics.map(metric => {
                        // Calculate if metric is within normal range
                        let status = "normal";
                        let statusColor = "bg-green-100 text-green-800";
                        
                        if (metric.normalRange) {
                          if (metric.value < metric.normalRange.min) {
                            status = "low";
                            statusColor = "bg-orange-100 text-orange-800";
                          } else if (metric.value > metric.normalRange.max) {
                            status = "high";
                            statusColor = "bg-red-100 text-red-800";
                          }
                        }
                        
                        return (
                          <div key={metric.id} className="health-card">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{metric.name}</span>
                              <Badge className={statusColor} variant="outline">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-xl font-bold">
                              {metric.value} {metric.unit}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {metric.normalRange && (
                                <span>Normal range: {metric.normalRange.min} - {metric.normalRange.max} {metric.unit}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="details">
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Doctor</h3>
                          <p className="mt-1">{activeReport.doctor}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Facility</h3>
                          <p className="mt-1">{activeReport.facility}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                          <p className="mt-1">{activeReport.date}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                        <p className="mt-1">{activeReport.notes}</p>
                      </div>
                      
                      {activeReport.fileUrl && (
                        <div className="mt-4">
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download Original Report
                          </Button>
                        </div>
                      )}
                    </div>
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

export default HealthReports;
