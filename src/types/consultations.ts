
export interface Consultation {
  id: string;
  title: string;
  date: string;
  doctor: string;
  facility: string;
  description: string;
  category: string;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  documentContent?: string;
  extractedData?: {
    diagnosisCodes?: string[];
    medications?: string[];
    followUpDate?: string;
    recommendations?: string[];
    additionalMetrics?: Record<string, string>; // For storing additional extracted data
  };
  status: 'processed' | 'pending' | 'error';
  isEncrypted: boolean;
}

export interface ConsultationFilter {
  searchTerm: string;
  category: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface ActivityLog {
  id: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'export' | 'decrypt' | 'security_check';
  timestamp: string;
  consultationId?: string;
  details: string;
  status: 'success' | 'failure';
}

export interface SecurityConfig {
  biometricEnabled: boolean;
  encryptionEnabled: boolean; // We'll keep this for future use
  encryptionKey?: string; // We'll keep this for future use
  lastAuthTime?: string;
  deviceId?: string;
}
