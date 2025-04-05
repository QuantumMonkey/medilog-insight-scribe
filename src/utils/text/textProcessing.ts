
/**
 * Post-processes OCR text to improve quality by fixing common OCR errors
 * @param text Raw OCR text
 * @returns Processed text with improved quality
 */
export const postProcessOcrText = (text: string): string => {
  if (!text) return '';
  
  // Remove excessive whitespace
  let processed = text.replace(/\s+/g, ' ');
  
  // Fix common OCR errors
  processed = processed
    .replace(/[|]l[|]/g, 'I') // Fix common I/l confusion
    .replace(/[|]1[|]/g, 'I') // Fix common I/1 confusion
    .replace(/0/g, 'O') // Fix common O/0 confusion in specific contexts
    .replace(/rnm/g, 'mm') // Fix common rn/m confusion
    .replace(/cl/g, 'd') // Fix common cl/d confusion
    .replace(/vv/g, 'w') // Fix common vv/w confusion
    .replace(/[({]3[)}]/g, 'B') // Fix common 3/B confusion
    .replace(/[({]5[)}]/g, 'S'); // Fix common 5/S confusion
  
  // Enhance medical terminology recognition
  const commonMedicalTerms = {
    'dlagnosis': 'diagnosis',
    'patjent': 'patient',
    'sympt0ms': 'symptoms',
    'prescriptjon': 'prescription',
    'medicatjon': 'medication',
    'allergjes': 'allergies',
    'blcod': 'blood',
    'pressuro': 'pressure'
  };
  
  // Replace common medical term OCR errors
  Object.entries(commonMedicalTerms).forEach(([error, correction]) => {
    const regex = new RegExp(error, 'gi');
    processed = processed.replace(regex, correction);
  });
  
  return processed;
};
