
import { Consultation } from "@/types/consultations";

// Simple mock OCR function that would be replaced with a real OCR service
export const extractTextFromDocument = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // In a real implementation, this would call an OCR service
    // For demo purposes, we'll simulate text extraction based on file type
    
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulate text extraction with mock data based on file type
      if (file.type === 'application/pdf') {
        resolve("MEDICAL CONSULTATION\nDate: 2025-03-28\nDr. Robert Smith\nPatient presents with symptoms of seasonal allergies.\nDiagnosis: J30.1 - Allergic rhinitis due to pollen\nPrescribed: Loratadine 10mg daily\nFollow-up in 3 months if symptoms persist.");
      } else if (file.type.startsWith('image/')) {
        resolve("MEDICAL REPORT\nPatient examination on 2025-04-01\nDr. Jennifer Lee, Cardiology\nBlood pressure: 125/82\nRecommendations: Continue current medication regimen\nNext appointment: 2025-07-01");
      } else {
        resolve("Medical document content extracted successfully. Please see the structured data for details.");
      }
    };
    
    reader.onerror = () => {
      resolve("Error extracting text from document.");
    };
    
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

// Extract structured data from the document text
export const extractStructuredData = (text: string) => {
  // This is a simplified version - in a real app, this would use more sophisticated NLP
  
  const extractDiagnosisCodes = (text: string) => {
    const codeRegex = /([A-Z][0-9]{2}(?:\.[0-9]+)?)/g;
    return text.match(codeRegex) || [];
  };
  
  const extractMedications = (text: string) => {
    const commonMeds = ["Loratadine", "Aspirin", "Ibuprofen", "Metformin", "Lisinopril", "Atorvastatin"];
    return commonMeds.filter(med => text.includes(med));
  };
  
  const extractFollowUpDate = (text: string) => {
    const dateRegex = /(follow|next|appointment).+?(\d{4}-\d{2}-\d{2})/i;
    const match = text.match(dateRegex);
    return match ? match[2] : undefined;
  };
  
  const extractRecommendations = (text: string) => {
    const recommendationRegex = /(recommend|advised|suggested).*?\./gi;
    const matches = text.match(recommendationRegex) || [];
    return matches.map(m => m.trim());
  };

  return {
    diagnosisCodes: extractDiagnosisCodes(text),
    medications: extractMedications(text),
    followUpDate: extractFollowUpDate(text),
    recommendations: extractRecommendations(text),
  };
};

// Process the uploaded document
export const processConsultationDocument = async (file: File, consultation: Partial<Consultation>): Promise<Partial<Consultation>> => {
  try {
    // Extract text from document
    const extractedText = await extractTextFromDocument(file);
    
    // Extract structured data from text
    const structuredData = extractStructuredData(extractedText);
    
    // Create a blob URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    // Return updated consultation with extracted data
    return {
      ...consultation,
      fileUrl,
      documentContent: extractedText,
      extractedData: structuredData,
      status: 'processed',
      isEncrypted: true, // Assume we encrypt all data
    };
  } catch (error) {
    console.error("Error processing document:", error);
    return {
      ...consultation,
      status: 'error',
    };
  }
};
