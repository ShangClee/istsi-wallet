/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import electron from "vite-plugin-electron/simple"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import tsconfigPaths from "vite-tsconfig-paths"
import { resolve } from "path"
import fs from "node:fs"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts"
  },
  plugins: [
    tsconfigPaths(),
    react(),
    nodePolyfills(),
    electron({
      main: {
        entry: "electron/src/index.prod.ts",
        vite: {
          build: {
            outDir: "dist-electron/main",
            rollupOptions: {
              external: ["electron", "electron-updater"]
            }
          },
          resolve: {
            alias: [
              // Replace deprecated built-in punycode with userland version
              { find: /^punycode$/, replacement: "punycode/" }
            ]
          }
        }
      },
      preload: {
        input: "electron/src/preload.ts",
        vite: {
          build: {
            outDir: "dist-electron/preload"
          }
        }
      },
      renderer: {}
    }),
    {
      name: "copy-electron-assets",
      closeBundle() {
        const src = resolve(__dirname, "electron/build")
        const dest = resolve(__dirname, "dist-electron/build")
        if (fs.existsSync(src)) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
          }
          fs.cpSync(src, dest, { recursive: true })
        }
      }
    }
  ],
  resolve: {
    alias: [
      { find: /^~/, replacement: resolve(__dirname, "src") + "/" },
      // Replace deprecated built-in punycode with userland version
      { find: /^punycode$/, replacement: "punycode/" }
    ]
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  optimizeDeps: {
    include: [
      "debug",
      "jsonwebtoken",
      "eventsource",
      "lodash.throttle",
      "p-queue",
      "react",
      "react-dom",
      "react-i18next",
      "stellar-sdk"
    ]
  }
})
