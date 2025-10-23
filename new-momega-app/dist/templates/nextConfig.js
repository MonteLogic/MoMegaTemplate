"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNextConfig = generateNextConfig;
function generateNextConfig(config) {
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
    }
    else {
        configContent += `
module.exports = nextConfig;
`;
    }
    return configContent;
}
//# sourceMappingURL=nextConfig.js.map