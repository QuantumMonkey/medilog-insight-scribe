
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
    fileUrl: "/consultation-doc-1.pdf",
    createdAt: "2023-05-12T10:30:00Z",
    updatedAt: "2023-05-12T10:30:00Z",
    documentContent: "ANNUAL PHYSICAL EXAMINATION\nDate: 2023-05-12\nPatient: John Doe\nPrimary Care Physician: Dr. Sarah Johnson\n\nVital Signs:\n- Blood Pressure: 120/80 mmHg\n- Heart Rate: 68 bpm\n- Temperature: 98.6°F\n- Weight: 170 lbs\n- Height: 5'10\"\n\nAssessment: Patient is in good health with all vitals within normal ranges.\n\nRecommendations: Continue current exercise routine and balanced diet. Follow up in 12 months for next annual checkup.",
    extractedData: {
      recommendations: ["Continue current exercise routine and balanced diet", "Follow up in 12 months for next annual checkup"]
    },
    status: "processed",
    isEncrypted: true
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
    fileUrl: "/consultation-doc-2.pdf",
    createdAt: "2023-07-23T14:15:00Z",
    updatedAt: "2023-07-23T14:15:00Z",
    documentContent: "CARDIOLOGY CONSULTATION\nDate: 2023-07-23\nCardiologist: Dr. Michael Chen\nFacility: Heart Institute\n\nReason for Visit: Follow-up after abnormal ECG reading\n\nTests Performed:\n- ECG: Normal sinus rhythm, no ST-T wave abnormalities\n- Blood Pressure: 125/78 mmHg\n\nDiagnosis: I50.9 - Heart failure, unspecified\n\nPlan:\n1. Reduce Lisinopril from 20mg to 10mg daily\n2. Continue Metoprolol 25mg twice daily\n3. Follow up in 3 months\n4. Call if experiencing chest pain, shortness of breath, or palpitations",
    extractedData: {
      diagnosisCodes: ["I50.9"],
      medications: ["Lisinopril", "Metoprolol"],
      followUpDate: "2023-10-23"
    },
    status: "processed",
    isEncrypted: true
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
    fileUrl: "/consultation-doc-3.pdf",
    createdAt: "2023-09-05T11:20:00Z",
    updatedAt: "2023-09-05T11:20:00Z",
    documentContent: "DERMATOLOGY CONSULTATION\nDate: 2023-09-05\nDermatologist: Dr. Emily Rodriguez\nFacility: Skin Care Center\n\nPresenting Complaint: Itchy red rash on forearms and neck\n\nExamination Findings: Erythematous, papular rash with mild scaling on bilateral forearms and anterior neck. No vesicles or pustules.\n\nDiagnosis: L23.7 - Allergic contact dermatitis due to plants, except food\n\nTreatment Plan:\n1. Triamcinolone 0.1% cream apply to affected areas twice daily for 10 days\n2. Advised to avoid potential allergens including new laundry detergent\n3. Return in 2 weeks if not improving\n\nEducation provided regarding potential environmental triggers for contact dermatitis.",
    extractedData: {
      diagnosisCodes: ["L23.7"],
      medications: ["Triamcinolone"],
      recommendations: ["Advised to avoid potential allergens including new laundry detergent", "Return in 2 weeks if not improving"]
    },
    status: "processed",
    isEncrypted: true
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
    fileUrl: "/consultation-doc-4.pdf",
    createdAt: "2023-10-18T09:45:00Z",
    updatedAt: "2023-10-18T09:45:00Z",
    documentContent: "ORTHOPEDIC ASSESSMENT\nDate: 2023-10-18\nOrthopedic Surgeon: Dr. James Wilson\nFacility: Sports Medicine Clinic\n\nChief Complaint: Right knee pain for 3 weeks following tennis match\n\nPhysical Examination: Mild joint effusion, positive McMurray's test, negative Lachman's test\n\nDiagnostic Studies: MRI of right knee shows minor medial meniscus tear, no ligamentous injury\n\nDiagnosis: S83.2 - Tear of meniscus, current injury\n\nTreatment Plan:\n1. Physical therapy 2 times weekly for 6 weeks\n2. Ibuprofen 600mg every 6 hours as needed for pain\n3. No surgical intervention needed at this time\n4. Avoid high-impact activities for 4-6 weeks\n\nPatient educated on proper use of crutches and advised regarding return to sports protocol.",
    extractedData: {
      diagnosisCodes: ["S83.2"],
      medications: ["Ibuprofen"],
      recommendations: ["Physical therapy 2 times weekly for 6 weeks", "Avoid high-impact activities for 4-6 weeks"]
    },
    status: "processed",
    isEncrypted: true
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
    fileUrl: "/consultation-doc-5.pdf",
    createdAt: "2024-01-07T13:30:00Z",
    updatedAt: "2024-01-07T13:30:00Z",
    documentContent: "NUTRITION CONSULTATION\nDate: 2024-01-07\nDietitian: Dr. Lisa Thompson, RD\nFacility: Wellness Center\n\nReason for Consultation: Weight management and energy optimization\n\nDietary Assessment:\n- Current caloric intake: approximately 2,200 kcal/day\n- Protein: 12% of total calories\n- Carbohydrates: 60% of total calories\n- Fat: 28% of total calories\n\nRecommendations:\n1. Increase protein intake to 20-25% of total calories\n2. Reduce processed food consumption by half\n3. Increase intake of leafy greens and fiber-rich vegetables\n4. Maintain hydration with minimum 64 oz water daily\n\nPersonalized meal plan provided to patient. Follow up in 2 months to assess progress and make adjustments as needed.\n\nRecommended supplement: Vitamin D3 1000 IU daily",
    extractedData: {
      recommendations: [
        "Increase protein intake to 20-25% of total calories",
        "Reduce processed food consumption by half",
        "Increase intake of leafy greens and fiber-rich vegetables",
        "Maintain hydration with minimum 64 oz water daily"
      ],
      followUpDate: "2024-03-07"
    },
    status: "processed",
    isEncrypted: true
  }
];
