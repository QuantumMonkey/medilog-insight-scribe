
import { Consultation, ConsultationFilter } from "@/types/consultations";
import { loadConsultations } from "./consultationData";

// Filter consultations based on criteria
export const filterConsultations = (filter: ConsultationFilter): Consultation[] => {
  const consultations = loadConsultations();
  
  return consultations.filter(consultation => {
    // Search term filter
    const matchesSearch = 
      filter.searchTerm === '' ||
      consultation.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      consultation.doctor.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      consultation.facility.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      consultation.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filter.category === 'all' || consultation.category === filter.category;
    
    // Date range filter
    let matchesDateRange = true;
    if (filter.dateRange) {
      const consultationDate = new Date(consultation.date);
      
      if (filter.dateRange.start) {
        const startDate = new Date(filter.dateRange.start);
        if (consultationDate < startDate) {
          matchesDateRange = false;
        }
      }
      
      if (filter.dateRange.end) {
        const endDate = new Date(filter.dateRange.end);
        if (consultationDate > endDate) {
          matchesDateRange = false;
        }
      }
    }
    
    return matchesSearch && matchesCategory && matchesDateRange;
  });
};
