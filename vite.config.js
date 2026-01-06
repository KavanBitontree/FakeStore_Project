import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env based on mode (development / production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
    server: {
      allowedHosts: [env.NGROK_HOST],
    },
  };
});
