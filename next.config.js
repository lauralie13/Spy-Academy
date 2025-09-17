/** @type {import('next').NextConfig} */
const nextConfig = {
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do NOT set output: 'export' — allows dynamic routes like /mission/[id]
};
module.exports = nextConfig;

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
