
import { createStorageItem } from '../storage/localStorageService';

// Define storage for API key if we decide to use an external LLM
const apiKeyStorage = createStorageItem({ 
  key: 'health-assistant-api-key', 
  defaultValue: '' 
});

// Types for health metrics that can be analyzed
export type HealthMetric = {
  name: string;
  value: number;
  unit: string;
  date: Date;
  normalRange?: {
    min: number;
    max: number;
  };
};

export type HealthQuery = {
  question: string;
  metrics?: HealthMetric[];
};

// Mock data for the assistant's responses when no external LLM is used
const medicalKnowledgeBase = {
  bloodPressure: {
    analyze: (systolic: number, diastolic: number) => {
      if (systolic < 120 && diastolic < 80) {
        return "Your blood pressure is normal.";
      } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
        return "Your blood pressure is elevated. This isn't high blood pressure, but it's a condition that may lead to high blood pressure if you don't make lifestyle changes.";
      } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        return "You have Stage 1 Hypertension. Consider lifestyle changes and consult with your healthcare provider.";
      } else if (systolic >= 140 || diastolic >= 90) {
        return "You have Stage 2 Hypertension. This requires medical attention. Please consult with your healthcare provider.";
      } else if (systolic > 180 || diastolic > 120) {
        return "This is a hypertensive crisis requiring immediate medical attention. Please contact emergency services or go to the nearest emergency room.";
      }
      return "Unable to analyze these blood pressure values. Please consult with your healthcare provider.";
    }
  },
  cholesterol: {
    analyze: (total: number, ldl: number, hdl: number) => {
      let analysis = "Total cholesterol: ";
      
      if (total < 200) {
        analysis += "Desirable. ";
      } else if (total >= 200 && total <= 239) {
        analysis += "Borderline high. ";
      } else {
        analysis += "High. ";
      }
      
      analysis += "LDL cholesterol: ";
      if (ldl < 100) {
        analysis += "Optimal. ";
      } else if (ldl >= 100 && ldl <= 129) {
        analysis += "Near optimal. ";
      } else if (ldl >= 130 && ldl <= 159) {
        analysis += "Borderline high. ";
      } else if (ldl >= 160 && ldl <= 189) {
        analysis += "High. ";
      } else {
        analysis += "Very high. ";
      }
      
      analysis += "HDL cholesterol: ";
      if (hdl < 40) {
        analysis += "Low (higher risk). ";
      } else if (hdl >= 60) {
        analysis += "High (protective). ";
      } else {
        analysis += "Moderate. ";
      }
      
      return analysis;
    }
  },
  glucose: {
    analyze: (value: number, isFasting: boolean) => {
      if (isFasting) {
        if (value < 70) {
          return "Your fasting glucose is low (hypoglycemia). This may require immediate attention.";
        } else if (value >= 70 && value <= 99) {
          return "Your fasting glucose is normal.";
        } else if (value >= 100 && value <= 125) {
          return "Your fasting glucose indicates prediabetes. Consider consulting with your healthcare provider.";
        } else {
          return "Your fasting glucose indicates diabetes. Please consult with your healthcare provider.";
        }
      } else {
        if (value < 140) {
          return "Your random glucose test is normal.";
        } else if (value >= 140 && value <= 199) {
          return "Your random glucose test indicates prediabetes. Consider consulting with your healthcare provider.";
        } else {
          return "Your random glucose test indicates diabetes. Please consult with your healthcare provider.";
        }
      }
    }
  },
  // Add more health metrics as needed
};

/**
 * Process a health query using either:
 * 1. The built-in knowledge base (default)
 * 2. An external LLM if API key is provided
 */
export const processHealthQuery = async (query: HealthQuery): Promise<string> => {
  const apiKey = apiKeyStorage.get();
  
  // Use external LLM if API key is available
  if (apiKey && apiKey.length > 0) {
    try {
      return await queryExternalLLM(query, apiKey);
    } catch (error) {
      console.error("Error querying external LLM:", error);
      return "I'm having trouble connecting to my knowledge base. Let me use my built-in analysis instead.\n\n" + 
             analyzeWithBuiltInKnowledge(query);
    }
  }
  
  // Fall back to built-in knowledge base
  return analyzeWithBuiltInKnowledge(query);
};

/**
 * Analyze health metrics using the built-in knowledge base
 */
const analyzeWithBuiltInKnowledge = (query: HealthQuery): string => {
  if (!query.metrics || query.metrics.length === 0) {
    return "I don't have any health metrics to analyze. Please provide some measurements for me to help you interpret them.";
  }

  // Check for blood pressure readings
  const systolic = query.metrics.find(m => m.name.toLowerCase() === "systolic blood pressure");
  const diastolic = query.metrics.find(m => m.name.toLowerCase() === "diastolic blood pressure");
  
  if (systolic && diastolic) {
    return medicalKnowledgeBase.bloodPressure.analyze(systolic.value, diastolic.value);
  }
  
  // Check for cholesterol readings
  const totalCholesterol = query.metrics.find(m => m.name.toLowerCase() === "total cholesterol");
  const ldl = query.metrics.find(m => m.name.toLowerCase() === "ldl cholesterol");
  const hdl = query.metrics.find(m => m.name.toLowerCase() === "hdl cholesterol");
  
  if (totalCholesterol && ldl && hdl) {
    return medicalKnowledgeBase.cholesterol.analyze(totalCholesterol.value, ldl.value, hdl.value);
  }
  
  // Check for glucose readings
  const glucose = query.metrics.find(m => m.name.toLowerCase().includes("glucose"));
  if (glucose) {
    const isFasting = glucose.name.toLowerCase().includes("fasting");
    return medicalKnowledgeBase.glucose.analyze(glucose.value, isFasting);
  }
  
  // Generic response if we can't specifically analyze the metrics
  let response = "Based on the provided metrics:\n\n";
  
  query.metrics.forEach(metric => {
    response += `${metric.name}: ${metric.value} ${metric.unit}\n`;
    
    if (metric.normalRange) {
      response += `Normal range: ${metric.normalRange.min} - ${metric.normalRange.max} ${metric.unit}\n`;
      
      if (metric.value < metric.normalRange.min) {
        response += "This value is below the normal range.\n";
      } else if (metric.value > metric.normalRange.max) {
        response += "This value is above the normal range.\n";
      } else {
        response += "This value is within the normal range.\n";
      }
    }
    
    response += "\n";
  });
  
  response += "Please consult with your healthcare provider for a comprehensive analysis of these values.";
  
  return response;
};

/**
 * Query an external LLM API with health data
 * This is a placeholder implementation that would need to be completed based on the chosen LLM provider
 */
const queryExternalLLM = async (query: HealthQuery, apiKey: string): Promise<string> => {
  // This is where you would implement the API call to an external LLM
  // For example, using OpenAI, Anthropic, or another provider
  
  // For now, we'll throw an error to indicate this isn't implemented yet
  throw new Error("External LLM integration not implemented");
};

/**
 * Set the API key for using an external LLM
 */
export const setHealthAssistantApiKey = (apiKey: string): void => {
  apiKeyStorage.set(apiKey);
};

/**
 * Check if an API key is configured
 */
export const hasHealthAssistantApiKey = (): boolean => {
  const key = apiKeyStorage.get();
  return key !== null && key !== undefined && key.length > 0;
};
