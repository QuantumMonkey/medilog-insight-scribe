
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.40470a235cbb49b5af10ee45028ff41d',
  appName: 'medilog-insight-scribe',
  webDir: 'dist',
  server: {
    url: "https://40470a23-5cbb-49b5-af10-ee45028ff41d.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF"
  },
  ios: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
