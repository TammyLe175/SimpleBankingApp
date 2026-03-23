/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendBaseUrl = process.env.BACKEND_API_BASE_URL ?? "http://localhost:5226";

    return [
      {
        source: "/api-proxy/:path*",
        destination: `${backendBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
