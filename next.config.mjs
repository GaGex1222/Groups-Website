/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "static.thenounproject.com",
          port: '',
          pathname: '/png/114836-200.png'
        }
      ]
    }
  };
  
  export default nextConfig;
  