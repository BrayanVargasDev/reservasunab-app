import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'unab.reservas',
  appName: 'Reservas UNAB',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  ios: {
    scheme: 'unab.reservas',
  },
  android: {
    path: 'unab.reservas',
  },
};

export default config;
