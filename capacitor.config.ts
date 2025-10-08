import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unab.reservas',
  appName: 'Reservas UNAB',
  webDir: 'www',
  plugins: {
    App: {
      scheme: 'com.unab.reservas',
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
