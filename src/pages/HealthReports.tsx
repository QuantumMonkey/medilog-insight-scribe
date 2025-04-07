
import React from 'react';
import { useHealthReports } from '@/hooks/useHealthReports';

import SearchBar from '@/components/health-reports/SearchBar';
import ReportsList from '@/components/health-reports/ReportsList';
import ReportDetail from '@/components/health-reports/ReportDetail';
import UploadDialog from '@/components/health-reports/UploadDialog';

const HealthReports = () => {
  const {
    searchTerm,
    setSearchTerm,
    activeReport,
    setActiveReport,
    knownDoctors,
    knownFacilities,
    handleUploadComplete,
    filteredReports
  } = useHealthReports();
  
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
