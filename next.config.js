/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Handle TypeScript path aliases
  webpack: (config) => {
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@store': path.resolve(__dirname, 'src/store')
    };
    return config;
  },

  // Environment variables
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    DB_PATH: process.env.DB_PATH || './data/tribit.db'
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp']
  },

  // Experimental features
  experimental: {
    typedRoutes: true
  }
};

module.exports = nextConfig;