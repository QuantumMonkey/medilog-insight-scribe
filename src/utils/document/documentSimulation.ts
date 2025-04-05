
/**
 * Simulates PDF extraction for testing purposes
 * @param file File object representing a PDF
 * @param resolve Resolve function to complete the promise
 */
export const simulatePdfExtraction = (file: File, resolve: (value: string) => void): void => {
  setTimeout(() => {
    resolve(`MEDICAL CONSULTATION\nDate: 2025-03-28\nDr. Robert Smith\nPatient presents with symptoms of seasonal allergies.\nDiagnosis: J30.1 - Allergic rhinitis due to pollen\nPrescribed: Loratadine 10mg daily\nFollow-up in 3 months if symptoms persist.\nBlood pressure: 125/82 mmHg\nPulse: 72 bpm\nRespiration: 16/min\nTemperature: 98.6°F\nHeight: 5'10"\nWeight: 170 lbs\nBMI: 24.4\nRecommended: Avoid outdoor activities during high pollen days.`);
  }, 1500);
};

/**
 * Simulates image extraction for testing purposes
 * @param file File object representing an image
 * @param resolve Resolve function to complete the promise
 */
export const simulateImageExtraction = (file: File, resolve: (value: string) => void): void => {
  setTimeout(() => {
    resolve(`MEDICAL REPORT\nPatient examination on 2025-04-01\nDr. Jennifer Lee, Cardiology\nBlood pressure: 125/82\nHeart rate: 68 bpm\nCholesterol: Total 185 mg/dL, LDL 110 mg/dL, HDL 55 mg/dL\nTriglycerides: 120 mg/dL\nECG results: Normal sinus rhythm\nRecommendations: Continue current medication regimen\nFollow-up: Schedule stress test before next appointment\nNext appointment: 2025-07-01`);
  }, 1200);
};

/**
 * Simulates generic document extraction for testing purposes
 * @param file Generic file object
 * @param resolve Resolve function to complete the promise
 */
export const simulateGenericExtraction = (file: File, resolve: (value: string) => void): void => {
  setTimeout(() => {
    resolve(`Medical document content extracted successfully.\nDate: 2025-04-02\nProvider: Medical Center\nPatient Visit Summary\nDiagnosis: General examination\nVital Signs: Within normal limits\nRecommendations: Continue healthy lifestyle\nNext Visit: In 6 months`);
  }, 800);
};
