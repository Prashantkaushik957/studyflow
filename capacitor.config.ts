import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studyflow.app',
  appName: 'StudyFlow',
  webDir: 'out',
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0a0a1a',
  },
  server: {
    // Use hostname for proper routing
    hostname: 'studyflow.app',
    androidScheme: 'https',
    iosScheme: 'https',
  },
};

export default config;
