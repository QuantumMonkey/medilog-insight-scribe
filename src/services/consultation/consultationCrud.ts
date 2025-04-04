
import { Consultation } from "@/types/consultations";
import { loadConsultations, saveConsultations } from "./consultationData";
import { logActivity } from "@/services/securityService";

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
