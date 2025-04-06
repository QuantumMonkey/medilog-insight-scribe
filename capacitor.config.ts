
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.medilogscribe',
  appName: 'medilog-insight-scribe',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF",
    statusBarStyle: "dark",
    statusBarBackgroundColor: "#FFFFFF",
    navigationBarColor: "#FFFFFF",
    translucent: true // Make status bar translucent
  },
  ios: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
