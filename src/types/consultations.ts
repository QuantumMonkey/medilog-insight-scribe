
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
