/** @type {import('next').NextConfig} */
const nextConfig = {
  // Di chuyển các config này ra khỏi experimental
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,

  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
    // Thêm để bỏ qua lỗi missing suspense
    missingSuspenseWithCSRBailout: false,
    isrFlushToDisk: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Bỏ static export để tránh lỗi prerendering
  // output: undefined, // Bỏ dòng này

  // Thêm webpack config để ignore ws modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        bufferutil: false,
        "utf-8-validate": false,
      };
    }

    // Ignore ws modules
    config.externals = config.externals || [];
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });

    return config;
  },
};


module.exports = nextConfig;
