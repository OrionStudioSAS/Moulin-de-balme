/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Le quota gratuit d'optimisation d'images Vercel est épuisé (erreur 402) : images servies telles quelles
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Les images du contenu sont lues depuis le disque par /fichiers/[...chemin]
    outputFileTracingIncludes: {
      "/fichiers/[...chemin]": ["./contenu/fichiers/**/*"],
    },
  },
};

export default nextConfig;
