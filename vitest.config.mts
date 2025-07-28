import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    exclude: [
      "prisma/**", // Excludes all files within the 'src/utils' directory
      "generated/**", // Excludes a specific file
      "node_modules/**",
      "components/ui/**",
      "next.config.ts",
      "postcss.config.mjs",
    ],
  },
});
