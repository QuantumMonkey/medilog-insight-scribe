import { useState, useEffect } from 'react';
import { sampleReports } from '@/data/sampleData';
import { HealthReport } from '@/types/health';

export function useHealthReports() {
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
  
  return {
    searchTerm,
    setSearchTerm,
    activeReport,
    setActiveReport,
    knownDoctors,
    knownFacilities,
    handleUploadComplete,
    filteredReports
  };
}
