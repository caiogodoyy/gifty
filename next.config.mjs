/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ["@libsql/client", "bcryptjs"] },
};
export default nextConfig;
