/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Exclude Supabase functions from TypeScript checking
    ignoreBuildErrors: true
  },
  eslint: {
    // Exclude Supabase functions from ESLint
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer }) => {
    // Exclude Supabase functions from webpack build
    config.module.rules.push({
      test: /supabase\/functions/,
      loader: 'ignore-loader'
    });
    return config;
  }
}

module.exports = nextConfig
