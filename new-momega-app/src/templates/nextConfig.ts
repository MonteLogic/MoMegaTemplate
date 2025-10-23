import { AppConfig } from '../types';

export function generateNextConfig(config: AppConfig): string {
  let configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
`;

  if (config.features.pwa) {
    configContent += `
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
`;
  } else {
    configContent += `
module.exports = nextConfig;
`;
  }

  return configContent;
}
