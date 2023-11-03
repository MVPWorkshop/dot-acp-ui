import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import mkcert from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    https: true,
  },
  plugins: [react(), svgr(), mkcert(), EnvironmentPlugin("all")],
});
