/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce memory usage during build
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
