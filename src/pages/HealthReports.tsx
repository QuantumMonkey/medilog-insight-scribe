
import React, { useState } from 'react';
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

const HealthReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReport, setActiveReport] = useState(sampleReports[0]);
  const { toast } = useToast();
  
  const handleUpload = () => {
    toast({
      title: "Report upload started",
      description: "Your report is being processed.",
    });
    
    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      toast({
        title: "Report uploaded successfully",
        description: "Your health report has been added to your records.",
      });
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload New Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Health Report</DialogTitle>
              <DialogDescription>
                Upload your health report document or enter details manually.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input id="report-title" placeholder="E.g., Annual Physical Examination" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-date">Report Date</Label>
                <Input id="report-date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doctor-name">Doctor's Name</Label>
                <Input id="doctor-name" placeholder="Dr. Jane Smith" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facility">Healthcare Facility</Label>
                <Input id="facility" placeholder="City Hospital" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file-upload">Upload Document (Optional)</Label>
                <Input id="file-upload" type="file" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleUpload}>Upload Report</Button>
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
