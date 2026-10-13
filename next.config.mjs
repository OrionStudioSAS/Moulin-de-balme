/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Le quota gratuit d'optimisation d'images Vercel est épuisé (erreur 402) : images servies telles quelles
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
