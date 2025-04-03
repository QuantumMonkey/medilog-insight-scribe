
import CryptoJS from 'crypto-js';
import { SecurityConfig } from '@/types/consultations';

// Storage keys
const SECURITY_CONFIG_KEY = 'medlog_security_config';
const ACTIVITY_LOG_KEY = 'medlog_activity_logs';

// Initialize security config with defaults
const initializeSecurityConfig = (): SecurityConfig => {
  // Generate a random device ID if not already set
  const deviceId = generateDeviceId();
  
  return {
    biometricEnabled: true,
    encryptionEnabled: true,
    deviceId,
    lastAuthTime: new Date().toISOString()
  };
};

// Generate a unique device identifier
const generateDeviceId = (): string => {
  const existingConfig = getSecurityConfig();
  if (existingConfig?.deviceId) {
    return existingConfig.deviceId;
  }
  
  // Generate a random device ID
  return `device_${Math.random().toString(36).substring(2, 15)}`;
};

// Load security configuration
export const getSecurityConfig = (): SecurityConfig | null => {
  try {
    const configData = localStorage.getItem(SECURITY_CONFIG_KEY);
    if (configData) {
      return JSON.parse(configData);
    }
    return null;
  } catch (error) {
    console.error("Error loading security config:", error);
    return null;
  }
};

// Save security configuration
export const saveSecurityConfig = (config: SecurityConfig): void => {
  try {
    localStorage.setItem(SECURITY_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving security config:", error);
  }
};

// Initialize security if not already set up
export const initializeSecurity = (): SecurityConfig => {
  const existingConfig = getSecurityConfig();
  if (existingConfig) {
    return existingConfig;
  }
  
  const newConfig = initializeSecurityConfig();
  saveSecurityConfig(newConfig);
  return newConfig;
};

// Log activity
export const logActivity = (
  action: 'view' | 'create' | 'update' | 'delete' | 'export' | 'decrypt' | 'security_check',
  details: string,
  status: 'success' | 'failure' = 'success',
  consultationId?: string
): void => {
  try {
    const logs = getActivityLogs();
    const newLog = {
      id: `log_${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      consultationId,
      details,
      status
    };
    
    logs.push(newLog);
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

// Get activity logs
export const getActivityLogs = (): any[] => {
  try {
    const logsData = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (logsData) {
      return JSON.parse(logsData);
    }
    return [];
  } catch (error) {
    console.error("Error getting activity logs:", error);
    return [];
  }
};

// Export logs as JSON
export const exportLogs = (): string => {
  const logs = getActivityLogs();
  return JSON.stringify(logs, null, 2);
};

// Request biometric authentication (simulated for now, will be replaced with Capacitor Plugin)
export const requestBiometricAuth = async (): Promise<boolean> => {
  // For now, we'll simulate successful auth
  // This will be replaced with actual biometric auth using Capacitor
  try {
    // Simulate biometric auth delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update last auth time
    const config = getSecurityConfig() || initializeSecurity();
    config.lastAuthTime = new Date().toISOString();
    saveSecurityConfig(config);
    
    logActivity('security_check', 'Biometric authentication successful', 'success');
    return true;
  } catch (error) {
    logActivity('security_check', `Biometric authentication failed: ${error}`, 'failure');
    return false;
  }
};

// Encrypt data
export const encryptData = (data: string): string => {
  try {
    const config = getSecurityConfig() || initializeSecurity();
    const encryptionKey = config.encryptionKey || config.deviceId;
    
    if (!encryptionKey) {
      throw new Error("Encryption key not available");
    }
    
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    logActivity('security_check', `Encryption failed: ${error}`, 'failure');
    return data; // Return unencrypted data on failure
  }
};

// Decrypt data
export const decryptData = (encryptedData: string): string => {
  try {
    const config = getSecurityConfig() || initializeSecurity();
    const encryptionKey = config.encryptionKey || config.deviceId;
    
    if (!encryptionKey) {
      throw new Error("Encryption key not available");
    }
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error("Decryption resulted in empty data");
    }
    
    logActivity('decrypt', 'Data decrypted successfully', 'success');
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    logActivity('decrypt', `Decryption failed: ${error}`, 'failure');
    return encryptedData; // Return encrypted data on failure
  }
};
