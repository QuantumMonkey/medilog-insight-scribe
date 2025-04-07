
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Edit } from "lucide-react";
import { HealthReport } from '@/types/health';

interface ReportDetailProps {
  report: HealthReport;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{report.title}</CardTitle>
            <CardDescription>
              {report.date} • {report.facility}
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
              {report.metrics.map(metric => {
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
                  <p className="mt-1">{report.doctor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Facility</h3>
                  <p className="mt-1">{report.facility}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="mt-1">{report.date}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="mt-1">{report.notes}</p>
              </div>
              
              {report.fileUrl && (
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
  );
};

export default ReportDetail;
