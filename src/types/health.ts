
export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  normalRange?: {
    min: number;
    max: number;
  };
  category: string;
}

export interface HealthReport {
  id: string;
  title: string;
  date: string;
  doctor: string;
  facility: string;
  metrics: HealthMetric[];
  notes: string;
  fileUrl?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes: string;
  forCondition: string;
  isActive: boolean;
  reminderTimes?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'report' | 'medication' | 'metric';
  title: string;
  details: string;
  relatedId: string;
}

export type HealthMetricCategory = 
  | 'Blood' 
  | 'Heart' 
  | 'Kidney' 
  | 'Liver' 
  | 'Thyroid' 
  | 'Glucose' 
  | 'Cholesterol'
  | 'General'
  | 'Other';
