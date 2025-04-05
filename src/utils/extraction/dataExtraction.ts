
/**
 * Extracts structured data from document text with improved NLP simulation
 * @param text Document text
 * @returns Object containing extracted structured data
 */
export const extractStructuredData = (text: string) => {
  // Extract diagnosis codes (ICD-10 format)
  const extractDiagnosisCodes = (text: string) => {
    // Improved regex for ICD-10 codes (covers more formats)
    const codeRegex = /([A-Z][0-9]{2}(?:\.[0-9]+)?)|([A-Z][0-9]{1,2})|([0-9]{3}(?:\.[0-9]+)?)/g;
    return text.match(codeRegex) || [];
  };
  
  // Extract medication information
  const extractMedications = (text: string) => {
    // Expanded list of medications to detect
    const commonMeds = [
      "Loratadine", "Aspirin", "Ibuprofen", "Metformin", "Lisinopril", 
      "Atorvastatin", "Amlodipine", "Hydrochlorothiazide", "Levothyroxine",
      "Simvastatin", "Omeprazole", "Prednisone", "Albuterol", "Fluoxetine",
      "Acetaminophen", "Amoxicillin", "Losartan", "Gabapentin"
    ];
    
    // Use a more sophisticated detection approach
    const foundMeds = [];
    for (const med of commonMeds) {
      // Look for medication names with common dosage patterns nearby
      const medRegex = new RegExp(`\\b${med}\\b[^.]*?(\\d+\\s*(?:mg|mcg|g|ml))?`, 'i');
      const match = text.match(medRegex);
      if (match) {
        foundMeds.push(match[0].trim());
      }
    }
    
    // Additional pattern to catch medications not in our list but followed by dosage
    const dosagePattern = /\b[A-Z][a-z]+(?:in)?(?:\s+[a-z]+)?\s+(\d+\s*(?:mg|mcg|g|ml))/gi;
    const dosageMatches = text.match(dosagePattern) || [];
    
    return [...foundMeds, ...dosageMatches];
  };
  
  // Extract follow-up dates
  const extractFollowUpDate = (text: string) => {
    // Improved date extraction with multiple formats
    const patterns = [
      /(follow|next|appointment).+?(\d{4}-\d{2}-\d{2})/i,
      /(follow|next|appointment).+?(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
      /(follow|next|appointment).+?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2},? \d{4}/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[2]) {
        return match[2];
      }
    }
    
    return undefined;
  };
  
  // Extract recommendations
  const extractRecommendations = (text: string) => {
    // Expanded patterns for recommendations
    const patterns = [
      /(recommend|advised|suggested|recommendation).+?\./gi,
      /patient (should|must|to).+?\./gi,
      /continue.+?(medication|treatment|therapy).+?\./gi
    ];
    
    let recommendations: string[] = [];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern) || [];
      recommendations = [...recommendations, ...matches.map(m => m.trim())];
    }
    
    return recommendations;
  };
  
  // Extract additional health metrics
  const extractAdditionalMetrics = (text: string) => {
    const metrics: Record<string, string> = {};
    
    // Blood pressure
    const bpMatch = text.match(/blood pressure:?\s*(\d{2,3}\/\d{2,3})/i);
    if (bpMatch) metrics['Blood Pressure'] = bpMatch[1];
    
    // Heart rate / pulse
    const hrMatch = text.match(/(heart rate|pulse):?\s*(\d{2,3})\s*(bpm)?/i);
    if (hrMatch) metrics['Heart Rate'] = `${hrMatch[2]} bpm`;
    
    // Weight
    const weightMatch = text.match(/weight:?\s*(\d{2,3}(?:\.\d)?)\s*(lbs|kg)/i);
    if (weightMatch) metrics['Weight'] = `${weightMatch[1]} ${weightMatch[2]}`;
    
    // Height
    const heightMatch = text.match(/height:?\s*((\d)'(\d{1,2})"|\d{1,3} cm)/i);
    if (heightMatch) metrics['Height'] = heightMatch[1];
    
    // Temperature
    const tempMatch = text.match(/temperature:?\s*(\d{2,3}(?:\.\d)?)\s*°?(F|C)/i);
    if (tempMatch) metrics['Temperature'] = `${tempMatch[1]}°${tempMatch[2]}`;
    
    // BMI
    const bmiMatch = text.match(/bmi:?\s*(\d{1,2}(?:\.\d)?)/i);
    if (bmiMatch) metrics['BMI'] = bmiMatch[1];
    
    // Cholesterol
    const cholMatch = text.match(/cholesterol:?\s*([^\.]+)/i);
    if (cholMatch) metrics['Cholesterol'] = cholMatch[1].trim();
    
    return metrics;
  };

  // Return all extracted data
  return {
    diagnosisCodes: extractDiagnosisCodes(text),
    medications: extractMedications(text),
    followUpDate: extractFollowUpDate(text),
    recommendations: extractRecommendations(text),
    additionalMetrics: extractAdditionalMetrics(text)
  };
};
