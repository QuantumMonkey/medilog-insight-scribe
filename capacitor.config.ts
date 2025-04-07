
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anubis.medilog',
  appName: 'MediLog',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF",
    statusBarStyle: "dark",
    statusBarBackgroundColor: "#FFFFFF",
    navigationBarColor: "#FFFFFF"
  },
  ios: {
    backgroundColor: "#FFFFFF"
  }
};

export default {
  appId: 'com.anubis.medilog', // Already correct
  appName: 'MediLog', // Already correct
  webDir: 'dist',
};
