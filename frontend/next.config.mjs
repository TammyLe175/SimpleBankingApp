/** @type {import('next').NextConfig} */
const allowedDevOrigins = (
  process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "192.168.1.173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig = {
  output: 'export',
  allowedDevOrigins,
};

export default nextConfig;
