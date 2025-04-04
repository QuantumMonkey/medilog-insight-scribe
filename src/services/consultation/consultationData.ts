
import { Consultation } from "@/types/consultations";
import { sampleConsultations } from "@/data/consultationData";
import { logActivity } from "@/services/securityService";

// Storage key for consultations
const STORAGE_KEY = 'medlog_consultations';

// Load consultations from localStorage or use sample data
export const loadConsultations = (): Consultation[] => {
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
export const saveConsultations = (consultations: Consultation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
  } catch (error) {
    console.error("Error saving consultations:", error);
    logActivity('update', `Failed to save consultations: ${error}`, 'failure');
  }
};
