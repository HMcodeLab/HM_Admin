/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "hopingminds.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sbs.ac.in",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hoping-minds.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hoping-minds-courses-1234.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.aiscribbles.com",
        port: "",
        pathname: "/img/variant/large-preview/**",
      },
      {
        protocol: "https",
        hostname: "hoping-minds-courses.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack: (config, { dev, isServer }) => {
    // Disable the React Dev Overlay original stack frame requests in development
    if (dev && !isServer) {
      config.resolve.alias[
        "next/dist/compiled/@next/react-dev-overlay/client"
      ] = false;
    }
    return config;
  },

  // Optional: if you want to silently reroute stack frame requests to avoid 404s
  /*
  async rewrites() {
    return [
      {
        source: "/__nextjs_original-stack-frames",
        destination: "/404",
      },
    ];
  },
  */
};

export default nextConfig;
