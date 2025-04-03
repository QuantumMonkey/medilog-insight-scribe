
import { Consultation } from "@/types/consultations";

export const sampleConsultations: Consultation[] = [
  {
    id: "c1",
    title: "Annual Checkup",
    date: "2023-05-12",
    doctor: "Dr. Sarah Johnson",
    facility: "City Health Clinic",
    category: "General",
    description: "Routine annual health examination",
    notes: "All vitals normal. Recommended to maintain current exercise routine and diet. Follow up in 12 months.",
    fileUrl: "/consultation-doc-1.pdf"
  },
  {
    id: "c2",
    title: "Cardiology Consultation",
    date: "2023-07-23",
    doctor: "Dr. Michael Chen",
    facility: "Heart Institute",
    category: "Cardiology",
    description: "Follow-up after abnormal ECG reading",
    notes: "ECG shows normalized patterns. Blood pressure within normal range. Reduced medication dosage and follow up in 3 months.",
    fileUrl: "/consultation-doc-2.pdf"
  },
  {
    id: "c3",
    title: "Dermatology Visit",
    date: "2023-09-05",
    doctor: "Dr. Emily Rodriguez",
    facility: "Skin Care Center",
    category: "Dermatology",
    description: "Skin rash examination",
    notes: "Diagnosed with contact dermatitis. Prescribed topical corticosteroid cream. Advised to avoid potential allergens.",
    fileUrl: "/consultation-doc-3.pdf"
  },
  {
    id: "c4",
    title: "Orthopedic Assessment",
    date: "2023-10-18",
    doctor: "Dr. James Wilson",
    facility: "Sports Medicine Clinic",
    category: "Orthopedics",
    description: "Knee pain evaluation",
    notes: "MRI shows minor meniscus tear. Recommended physical therapy for 6 weeks. No surgical intervention needed at this time.",
    fileUrl: "/consultation-doc-4.pdf"
  },
  {
    id: "c5",
    title: "Nutrition Consultation",
    date: "2024-01-07",
    doctor: "Dr. Lisa Thompson",
    facility: "Wellness Center",
    category: "Nutrition",
    description: "Dietary assessment and planning",
    notes: "Created personalized nutrition plan. Recommended increase in protein intake and reduction in processed foods. Follow up in 2 months to assess progress.",
    fileUrl: "/consultation-doc-5.pdf"
  }
];
