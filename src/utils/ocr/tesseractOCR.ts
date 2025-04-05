
import { createWorker } from 'tesseract.js';

/**
 * Performs OCR on an image using Tesseract.js
 * @param image URL or path to the image
 * @returns Object containing the extracted text or null if failed
 */
export const performOCR = async (image: string): Promise<{ text: string } | null> => {
  try {
    // Create a worker and initialize it with English language
    const worker = await createWorker('eng');
    
    // Perform the actual recognition
    const result = await worker.recognize(image);
    const extractedText = result.data.text;
    
    // Clean up resources
    await worker.terminate();
    
    return { text: extractedText };
  } catch (error) {
    console.error('OCR Error:', error);
    return null;
  }
};
