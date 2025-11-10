/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["indiacsr.in","drdy957pjga3n.cloudfront.net"],
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
      {
        protocol: "https",
        hostname: "indiacsr.in",
        port: "",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "euphoriaxr.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      config.resolve.alias[
        "next/dist/compiled/@next/react-dev-overlay/client"
      ] = false;
    }
    return config;
  },
};

module.exports = nextConfig;
