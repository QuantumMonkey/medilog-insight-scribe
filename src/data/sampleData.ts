
import { HealthMetric, HealthReport, Medication, TimelineEvent } from "@/types/health";

// Sample health metrics
export const sampleMetrics: HealthMetric[] = [
  {
    id: "m1",
    name: "Hemoglobin",
    value: 14.5,
    unit: "g/dL",
    date: "2023-10-15",
    normalRange: {
      min: 13.5,
      max: 17.5
    },
    category: "Blood"
  },
  {
    id: "m2",
    name: "Blood Pressure (Systolic)",
    value: 125,
    unit: "mmHg",
    date: "2023-10-15",
    normalRange: {
      min: 90,
      max: 120
    },
    category: "Heart"
  },
  {
    id: "m3",
    name: "Blood Pressure (Diastolic)",
    value: 82,
    unit: "mmHg",
    date: "2023-10-15",
    normalRange: {
      min: 60,
      max: 80
    },
    category: "Heart"
  },
  {
    id: "m4",
    name: "Total Cholesterol",
    value: 185,
    unit: "mg/dL",
    date: "2023-10-15",
    normalRange: {
      min: 125,
      max: 200
    },
    category: "Cholesterol"
  },
  {
    id: "m5",
    name: "Glucose (Fasting)",
    value: 92,
    unit: "mg/dL",
    date: "2023-10-15",
    normalRange: {
      min: 70,
      max: 100
    },
    category: "Glucose"
  },
  {
    id: "m6",
    name: "TSH",
    value: 2.5,
    unit: "mIU/L",
    date: "2023-10-15",
    normalRange: {
      min: 0.4,
      max: 4.0
    },
    category: "Thyroid"
  },
  {
    id: "m7",
    name: "HDL Cholesterol",
    value: 62,
    unit: "mg/dL",
    date: "2023-07-10",
    normalRange: {
      min: 40,
      max: 60
    },
    category: "Cholesterol"
  },
  {
    id: "m8",
    name: "LDL Cholesterol",
    value: 110,
    unit: "mg/dL",
    date: "2023-07-10",
    normalRange: {
      min: 0,
      max: 100
    },
    category: "Cholesterol"
  },
  {
    id: "m9",
    name: "Triglycerides",
    value: 120,
    unit: "mg/dL",
    date: "2023-07-10",
    normalRange: {
      min: 0,
      max: 150
    },
    category: "Cholesterol"
  },
  {
    id: "m10",
    name: "Creatinine",
    value: 0.9,
    unit: "mg/dL",
    date: "2023-07-10",
    normalRange: {
      min: 0.6,
      max: 1.2
    },
    category: "Kidney"
  }
];

// Sample health reports
export const sampleReports: HealthReport[] = [
  {
    id: "r1",
    title: "Annual Physical Examination",
    date: "2023-10-15",
    doctor: "Dr. Sarah Johnson",
    facility: "City Health Clinic",
    metrics: sampleMetrics.slice(0, 6),
    notes: "Patient is in good health. Recommended to maintain current diet and exercise routine."
  },
  {
    id: "r2",
    title: "Lipid Profile Test",
    date: "2023-07-10",
    doctor: "Dr. Michael Chen",
    facility: "Metro Hospital Lab",
    metrics: sampleMetrics.slice(6, 10),
    notes: "Overall cholesterol levels are within normal range. Continue with current medication. Follow up in 6 months."
  }
];

// Sample medications
export const sampleMedications: Medication[] = [
  {
    id: "med1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2023-01-15",
    notes: "Take in the morning with food",
    forCondition: "Blood pressure management",
    isActive: true,
    reminderTimes: ["08:00"]
  },
  {
    id: "med2",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    startDate: "2023-02-20",
    notes: "Take at bedtime",
    forCondition: "Cholesterol management",
    isActive: true,
    reminderTimes: ["21:00"]
  },
  {
    id: "med3",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2023-03-10",
    notes: "Take with breakfast and dinner",
    forCondition: "Blood sugar management",
    isActive: true,
    reminderTimes: ["08:00", "19:00"]
  },
  {
    id: "med4",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: "2023-09-05",
    endDate: "2023-09-12",
    notes: "Complete the full course as prescribed",
    forCondition: "Bacterial infection",
    isActive: false
  }
];

// Sample timeline events
export const sampleTimelineEvents: TimelineEvent[] = [
  {
    id: "e1",
    date: "2023-10-15",
    type: "report",
    title: "Annual Physical Examination",
    details: "Completed annual physical with Dr. Sarah Johnson",
    relatedId: "r1"
  },
  {
    id: "e2",
    date: "2023-09-05",
    type: "medication",
    title: "Started Amoxicillin",
    details: "Started course of Amoxicillin for respiratory infection",
    relatedId: "med4"
  },
  {
    id: "e3",
    date: "2023-07-10",
    type: "report",
    title: "Lipid Profile Test",
    details: "Completed lipid profile test at Metro Hospital",
    relatedId: "r2"
  },
  {
    id: "e4",
    date: "2023-03-10",
    type: "medication",
    title: "Started Metformin",
    details: "Started Metformin for blood sugar management",
    relatedId: "med3"
  },
  {
    id: "e5",
    date: "2023-02-20",
    type: "medication",
    title: "Started Atorvastatin",
    details: "Started Atorvastatin for cholesterol management",
    relatedId: "med2"
  },
  {
    id: "e6",
    date: "2023-01-15",
    type: "medication",
    title: "Started Lisinopril",
    details: "Started Lisinopril for blood pressure management",
    relatedId: "med1"
  }
];

// Get metric data for charts
export const getMetricHistory = (metricName: string): {date: string, value: number}[] => {
  // In a real app, this would fetch from a database
  // For now, generate some sample data
  const today = new Date();
  const result = [];
  
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Generate a somewhat realistic value based on the metric
    let baseValue = 0;
    let variance = 0;
    
    switch(metricName) {
      case "Hemoglobin":
        baseValue = 14.5;
        variance = 1.5;
        break;
      case "Blood Pressure (Systolic)":
        baseValue = 120;
        variance = 15;
        break;
      case "Total Cholesterol":
        baseValue = 180;
        variance = 20;
        break;
      case "Glucose (Fasting)":
        baseValue = 95;
        variance = 10;
        break;
      default:
        baseValue = 100;
        variance = 10;
    }
    
    const randomValue = baseValue + (Math.random() * variance * 2 - variance);
    result.push({
      date: date.toISOString().split('T')[0],
      value: Number(randomValue.toFixed(1))
    });
  }
  
  return result.reverse();
};
