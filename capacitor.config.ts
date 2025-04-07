
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anubis.medilog',
  appName: 'MediLog',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default {
  appId: 'com.anubis.medilog',
  appName: 'MediLog',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};