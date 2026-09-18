import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Default is 1MB — too small for the audio files a battle submission
    // uploads (app/battles/[id]/actions.ts).
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
