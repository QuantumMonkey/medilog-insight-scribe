
import { logActivity } from "@/services/securityService";
import { getAllConsultations } from "./consultationCrud";

// Export consultations to JSON
export const exportConsultations = (): string => {
  try {
    const consultations = getAllConsultations();
    const exportData = {
      consultations,
      exportDate: new Date().toISOString(),
      totalCount: consultations.length
    };
    
    logActivity('export', `Exported ${consultations.length} consultations`, 'success');
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    logActivity('export', `Failed to export consultations: ${error}`, 'failure');
    return JSON.stringify({ error: "Export failed", message: String(error) });
  }
};
