
/**
 * Types for database entities in the MediLog application
 */

// Base entity type with common fields
export interface BaseEntity {
  id?: number;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

// Health report entity
export interface HealthReport extends BaseEntity {
  title: string;
  date: string;
  doctorName: string;
  facilityName: string;
  type: 'Lab Test' | 'Imaging' | 'Physical Exam' | 'Specialist Consult' | 'Dental' | 'Vision' | 'Other';
  summary: string;
  content: string;
  fileUrl?: string;
  documentContent?: string;
  extractedData?: Record<string, any>;
  tags?: string[];
}

// Vital metric entity
export interface VitalMetric extends BaseEntity {
  type: 'Blood Pressure' | 'Heart Rate' | 'Blood Sugar' | 'Weight' | 'Temperature' | 'SpO2' | 'Respiratory Rate' | 'Other';
  value: number;
  unit: string;
  date: string;
  time: string;
  notes?: string;
}

// Medication entity
export interface Medication extends BaseEntity {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  prescribedBy?: string;
  reason?: string;
  notes?: string;
  reminders?: MedicationReminder[];
}

// Medication reminder type
export interface MedicationReminder {
  id: string;
  time: string;
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  enabled: boolean;
}

// Consultation entity
export interface Consultation extends BaseEntity {
  title: string;
  doctorName: string;
  speciality?: string;
  facilityName?: string;
  date: string;
  time?: string;
  reason?: string;
  notes?: string;
  followUp?: string;
  prescriptions?: string[];
  fileUrl?: string;
  documentContent?: string;
  extractedData?: Record<string, any>;
  status?: 'upcoming' | 'completed' | 'cancelled' | 'processed' | 'error';
}

// User profile entity
export interface UserProfile extends BaseEntity {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContacts?: EmergencyContact[];
  prefersDarkMode?: boolean;
  consentToDataCollection?: boolean;
}

// Emergency contact type
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
}

// Document entity for OCR and data extraction
export interface Document extends BaseEntity {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  contentType: 'Health Report' | 'Consultation' | 'Prescription' | 'Insurance' | 'Other';
  processedText?: string;
  extractedData?: Record<string, any>;
  status: 'pending' | 'processing' | 'processed' | 'error';
  parentEntityType?: 'healthReport' | 'consultation' | 'medication';
  parentEntityId?: number;
}

// Settings type for app configuration
export interface AppSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  reminderNotifications: boolean;
  dataSyncEnabled: boolean;
  biometricsEnabled: boolean;
  dataExportFormat: 'json' | 'csv' | 'pdf';
  privacyMask: boolean;
}
