
import { Consultation } from "@/types/consultations";
import { logActivity } from "@/services/securityService";
import { performOCR } from "./ocr/tesseractOCR";
import { postProcessOcrText } from "./text/textProcessing";
import { 
  simulatePdfExtraction, 
  simulateImageExtraction, 
  simulateGenericExtraction 
} from "./document/documentSimulation";
import { extractStructuredData } from "./extraction/dataExtraction";

/**
 * Extracts text from a document using OCR or other appropriate methods
 * @param file File to extract text from
 * @returns Promise resolving to the extracted text
 */
export const extractTextFromDocument = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Log the processing attempt
      logActivity('create', `Processing document: ${file.name}`, 'success');
      
      // Handle different file types
      if (file.type === 'application/pdf') {
        // For a real app, would use PDF.js or a PDF extraction library
        // This is a simplified version for the demo
        simulatePdfExtraction(file, resolve);
      } else if (file.type.startsWith('image/')) {
        // Use Tesseract.js for image OCR with enhanced configuration
        const imageUrl = URL.createObjectURL(file);
        
        try {
          // Enhanced Tesseract configuration with proper typing
          const result = await performOCR(imageUrl);
          
          URL.revokeObjectURL(imageUrl); // Clean up
          
          if (result) {
            // Post-process the text for better results
            const processedText = postProcessOcrText(result.text);
            resolve(processedText);
          } else {
            // Fallback to mock data if OCR failed
            simulateImageExtraction(file, resolve);
          }
        } catch (error) {
          console.error("Tesseract OCR error:", error);
          URL.revokeObjectURL(imageUrl); // Clean up even on error
          
          // Fallback to mock data on error
          simulateImageExtraction(file, resolve);
        }
      } else if (file.type === 'text/plain') {
        // For text files, just read the content
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string || "");
        };
        reader.onerror = () => {
          reject("Error reading text file");
        };
        reader.readAsText(file);
      } else {
        // For other file types, use mock data
        simulateGenericExtraction(file, resolve);
      }
    } catch (error) {
      console.error("Document processing error:", error);
      logActivity('create', `Failed to process document: ${error}`, 'failure');
      
      // Provide a fallback response
      resolve("Error extracting text from document. Please try another file format.");
    }
  });
};

/**
 * Process the uploaded document and update consultation data
 * @param file Document file to process
 * @param consultation Consultation data to update
 * @returns Updated consultation data with extracted information
 */
export const processConsultationDocument = async (file: File, consultation: Partial<Consultation>): Promise<Partial<Consultation>> => {
  try {
    // Log the document processing attempt
    logActivity('create', `Processing document for consultation: ${consultation.title}`, 'success');
    
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
      isEncrypted: false, // Encryption disabled per request
    };
  } catch (error) {
    console.error("Error processing document:", error);
    logActivity('create', `Error processing document: ${error}`, 'failure');
    
    return {
      ...consultation,
      status: 'error',
    };
  }
};

// Re-export extractStructuredData for use elsewhere
export { extractStructuredData };
