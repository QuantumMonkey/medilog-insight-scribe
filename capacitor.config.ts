
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.medilogscribe',
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

export default config;
