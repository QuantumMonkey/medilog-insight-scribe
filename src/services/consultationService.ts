
import { Consultation, ConsultationFilter } from "@/types/consultations";
import { sampleConsultations } from "@/data/consultationData";
import { encryptData, decryptData, logActivity, initializeSecurity } from "@/services/securityService";

// Storage key for consultations
const STORAGE_KEY = 'medlog_consultations';

// Initialize security
initializeSecurity();

// Encrypt consultation data for storage
const encryptConsultation = (consultation: Consultation): Consultation => {
  if (!consultation.isEncrypted) {
    return consultation;
  }
  
  try {
    // Encrypt sensitive fields
    const sensitiveData = JSON.stringify({
      doctor: consultation.doctor,
      description: consultation.description,
      notes: consultation.notes,
      documentContent: consultation.documentContent,
      extractedData: consultation.extractedData
    });
    
    const encryptedData = encryptData(sensitiveData);
    
    return {
      ...consultation,
      doctor: '[Encrypted]',
      description: '[Encrypted]',
      notes: '[Encrypted]',
      documentContent: '[Encrypted]',
      _encryptedData: encryptedData // Store encrypted data separately
    } as any;
  } catch (error) {
    console.error("Error encrypting consultation:", error);
    logActivity('security_check', `Failed to encrypt consultation ${consultation.id}`, 'failure', consultation.id);
    return consultation;
  }
};

// Decrypt consultation data for viewing
const decryptConsultation = (consultation: any): Consultation => {
  if (!consultation.isEncrypted || !consultation._encryptedData) {
    return consultation;
  }
  
  try {
    const decryptedDataStr = decryptData(consultation._encryptedData);
    const decryptedData = JSON.parse(decryptedDataStr);
    
    const result = {
      ...consultation,
      doctor: decryptedData.doctor || consultation.doctor,
      description: decryptedData.description || consultation.description,
      notes: decryptedData.notes || consultation.notes,
      documentContent: decryptedData.documentContent || consultation.documentContent,
      extractedData: decryptedData.extractedData || consultation.extractedData
    };
    
    // Remove the encrypted data field before returning
    delete result._encryptedData;
    
    return result;
  } catch (error) {
    console.error("Error decrypting consultation:", error);
    logActivity('decrypt', `Failed to decrypt consultation ${consultation.id}`, 'failure', consultation.id);
    return consultation;
  }
};

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
      isEncrypted: true,
    }));
    
    // Encrypt and save enhanced sample data to localStorage
    const encryptedData = enhancedSampleData.map(encryptConsultation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedData));
    
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
    const encryptedConsultations = consultations.map(encryptConsultation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedConsultations));
  } catch (error) {
    console.error("Error saving consultations:", error);
    logActivity('update', `Failed to save consultations: ${error}`, 'failure');
  }
};

// Get all consultations
export const getAllConsultations = (): Consultation[] => {
  const consultations = loadConsultations();
  logActivity('view', 'Retrieved all consultations', 'success');
  return consultations.map(decryptConsultation);
};

// Get a consultation by ID
export const getConsultationById = (id: string): Consultation | undefined => {
  const consultations = loadConsultations();
  const encryptedConsultation = consultations.find(consultation => consultation.id === id);
  
  if (encryptedConsultation) {
    logActivity('view', `Retrieved consultation ${id}`, 'success', id);
    return decryptConsultation(encryptedConsultation);
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
    isEncrypted: true,
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
  
  // Decrypt first to ensure we have the full data
  const currentConsultation = decryptConsultation(consultations[index]);
  
  consultations[index] = {
    ...currentConsultation,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveConsultations(consultations);
  logActivity('update', `Updated consultation ${id}`, 'success', id);
  return decryptConsultation(consultations[index]);
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
  const consultations = loadConsultations().map(decryptConsultation);
  
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
