
import { Consultation, ConsultationFilter } from "@/types/consultations";
import { sampleConsultations } from "@/data/consultationData";
import { logActivity, initializeSecurity } from "@/services/securityService";

// Storage key for consultations
const STORAGE_KEY = 'medlog_consultations';

// Initialize security
initializeSecurity();

// Load consultations from localStorage or use sample data
const loadConsultations = (): Consultation[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const consultations = JSON.parse(storedData);
      return consultations;
    }
    
    // If no data in localStorage, use sample data and update it with additional fields
    const enhancedSampleData = sampleConsultations.map(item => ({
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'processed' as const,
      isEncrypted: false, // Set to false since we're not encrypting
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enhancedSampleData));
    
    return enhancedSampleData;
  } catch (error) {
    console.error("Error loading consultations:", error);
    logActivity('view', `Failed to load consultations: ${error}`, 'failure');
    return [];
  }
};

// Save consultations to localStorage
const saveConsultations = (consultations: Consultation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
  } catch (error) {
    console.error("Error saving consultations:", error);
    logActivity('update', `Failed to save consultations: ${error}`, 'failure');
  }
};

// Get all consultations
export const getAllConsultations = (): Consultation[] => {
  const consultations = loadConsultations();
  logActivity('view', 'Retrieved all consultations', 'success');
  return consultations;
};

// Get a consultation by ID
export const getConsultationById = (id: string): Consultation | undefined => {
  const consultations = loadConsultations();
  const consultation = consultations.find(consultation => consultation.id === id);
  
  if (consultation) {
    logActivity('view', `Retrieved consultation ${id}`, 'success', id);
    return consultation;
  }
  
  return undefined;
};

// Add a new consultation
export const addConsultation = (consultation: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>): Consultation => {
  const consultations = loadConsultations();
  const now = new Date().toISOString();
  
  const newConsultation: Consultation = {
    ...consultation,
    id: `c${consultations.length + 1}`,
    createdAt: now,
    updatedAt: now,
    status: consultation.status || 'pending',
    isEncrypted: false, // Set to false since we're not encrypting
  };
  
  consultations.push(newConsultation);
  saveConsultations(consultations);
  
  logActivity('create', `Created new consultation: ${newConsultation.title}`, 'success', newConsultation.id);
  return newConsultation;
};

// Update an existing consultation
export const updateConsultation = (id: string, updates: Partial<Consultation>): Consultation | undefined => {
  const consultations = loadConsultations();
  const index = consultations.findIndex(consultation => consultation.id === id);
  
  if (index === -1) return undefined;
  
  consultations[index] = {
    ...consultations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveConsultations(consultations);
  logActivity('update', `Updated consultation ${id}`, 'success', id);
  return consultations[index];
};

// Delete a consultation
export const deleteConsultation = (id: string): boolean => {
  const consultations = loadConsultations();
  const filteredConsultations = consultations.filter(consultation => consultation.id !== id);
  
  if (filteredConsultations.length === consultations.length) {
    return false;
  }
  
  saveConsultations(filteredConsultations);
  logActivity('delete', `Deleted consultation ${id}`, 'success', id);
  return true;
};

// Filter consultations based on criteria
export const filterConsultations = (filter: ConsultationFilter): Consultation[] => {
  const consultations = loadConsultations();
  
  return consultations.filter(consultation => {
    // Search term filter
    const matchesSearch = 
      filter.searchTerm === '' ||
      consultation.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      consultation.doctor.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      consultation.facility.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      consultation.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filter.category === 'all' || consultation.category === filter.category;
    
    // Date range filter
    let matchesDateRange = true;
    if (filter.dateRange) {
      const consultationDate = new Date(consultation.date);
      
      if (filter.dateRange.start) {
        const startDate = new Date(filter.dateRange.start);
        if (consultationDate < startDate) {
          matchesDateRange = false;
        }
      }
      
      if (filter.dateRange.end) {
        const endDate = new Date(filter.dateRange.end);
        if (consultationDate > endDate) {
          matchesDateRange = false;
        }
      }
    }
    
    return matchesSearch && matchesCategory && matchesDateRange;
  });
};

// Export consultations to JSON
export const exportConsultations = (): string => {
  try {
    const consultations = getAllConsultations();
    const exportData = {
      consultations,
      exportDate: new Date().toISOString(),
      totalCount: consultations.length
    };
    
    logActivity('export', `Exported ${consultations.length} consultations`, 'success');
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    logActivity('export', `Failed to export consultations: ${error}`, 'failure');
    return JSON.stringify({ error: "Export failed", message: String(error) });
  }
};
