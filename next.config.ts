import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acessar o servidor de dev pelo IP da rede local (ex: testar no
  // celular), sem isso o Next bloqueia os recursos de dev (HMR/JS) desse
  // origin e a página fica sem interatividade.
  allowedDevOrigins: ["192.168.0.13"],
};

export default nextConfig;
