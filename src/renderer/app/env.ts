export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  appName: import.meta.env.VITE_APP_NAME ?? 'My Electron IDE',
};
