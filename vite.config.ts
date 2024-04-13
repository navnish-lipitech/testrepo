import * as packageJson from "./package.json";

import react from "@vitejs/plugin-react";
import { resolve } from "path";

import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ["lib"],
    }),
    cssInjectedByJsPlugin(),
    // Enable it to use yalc for development
    // {
    //   name: "build-end",
    //   closeBundle() {
    //     execSync("yalc push --sig", {
    //       stdio: "inherit",
    //     });
    //   },
    // },
  ],
  // optimizeDeps: {
  //   // include: [...Object.keys(packageJson.peerDependencies || {})],
  //   // exclude: ["@lipihipi/rtc-ui-components"],
  // },
  build: {
    copyPublicDir: false,
    sourcemap: true,
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "lib/index.tsx"),
      formats: ["es", "umd"],
      name: "rtc-blog",
      fileName: (format) => {
        if (format === "es") {
          return "index.esm.js";
        }

        return "index.js";
      },
    },
    // outDir: "build",
    rollupOptions: {
      // watch: {
      //   exclude: ["**/node_modules/!(@lipihipi)**"],
      // },
      output: {
        globals: Object.fromEntries(
          Object.keys(packageJson.peerDependencies || {}).map((key) => [
            key,
            key,
          ])
        ),
      },
      external: [...Object.keys(packageJson.peerDependencies || {})],
    },
  },
}));
