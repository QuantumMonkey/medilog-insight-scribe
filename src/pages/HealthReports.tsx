
import React, { useState, useEffect } from 'react';
import { sampleReports } from '@/data/sampleData';
import { HealthReport } from '@/types/health';

import SearchBar from '@/components/health-reports/SearchBar';
import ReportsList from '@/components/health-reports/ReportsList';
import ReportDetail from '@/components/health-reports/ReportDetail';
import UploadDialog from '@/components/health-reports/UploadDialog';

const HealthReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReport, setActiveReport] = useState<HealthReport | null>(sampleReports[0] || null);
  const [knownDoctors, setKnownDoctors] = useState<string[]>([]);
  const [knownFacilities, setKnownFacilities] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract unique doctors and facilities from the reports
    const doctors = Array.from(new Set(sampleReports.map(report => report.doctor)));
    const facilities = Array.from(new Set(sampleReports.map(report => report.facility)));
    
    setKnownDoctors(['Self', ...doctors]);
    setKnownFacilities(['Self', ...facilities]);
  }, []);
  
  const handleUploadComplete = () => {
    // In a real app, we would refresh the reports list here
    // For now, we'll just keep using the sample data
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
        
        <UploadDialog 
          knownDoctors={knownDoctors} 
          knownFacilities={knownFacilities}
          onUploadComplete={handleUploadComplete}
        />
      </div>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <ReportsList 
            reports={filteredReports} 
            activeReport={activeReport} 
            onSelectReport={setActiveReport} 
          />
        </div>
        
        {activeReport && (
          <div className="col-span-1 lg:col-span-2">
            <ReportDetail report={activeReport} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthReports;
