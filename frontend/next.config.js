const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Next loads env files from `frontend` before evaluating this config and
// @next/env caches that first load. Force a reload so the repo-root `.env`
// is actually read and its NEXT_PUBLIC values are included in the client bundle.
loadEnvConfig(path.join(__dirname, '..'), process.env.NODE_ENV === 'development', console, true);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  devIndicators: false,
  experimental: {
    cpus: 1,
  },
};

module.exports = nextConfig;

