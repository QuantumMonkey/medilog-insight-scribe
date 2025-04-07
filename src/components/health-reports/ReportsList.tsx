
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, User } from "lucide-react";
import { HealthReport } from '@/types/health';

interface ReportsListProps {
  reports: HealthReport[];
  activeReport: HealthReport | null;
  onSelectReport: (report: HealthReport) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, activeReport, onSelectReport }) => {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No reports found matching your search.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <Card 
          key={report.id} 
          className={`cursor-pointer hover:shadow-md transition-all ${activeReport?.id === report.id ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelectReport(report)}
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
      ))}
    </div>
  );
};

export default ReportsList;
