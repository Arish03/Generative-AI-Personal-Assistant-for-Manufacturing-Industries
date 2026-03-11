import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../backend/.env") });

const nextConfig: NextConfig = {

  transpilePackages: ["@gap/db"],
  serverExternalPackages: ["mongoose"],
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT,
    AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth).*)", // proxy all /api paths except /api/auth
        destination: "http://localhost:4000/api/:path*", // to the backend server
      },
    ];
  },
};

export default nextConfig;
