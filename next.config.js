// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.poap.tech' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'assets.poap.xyz' },
    ],
  },
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
