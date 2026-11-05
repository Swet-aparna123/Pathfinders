const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  devIndicators: false,
  experimental: {
    cpus: 1,
  },
};

module.exports = nextConfig;

