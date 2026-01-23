import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import tsconfigPaths from "vite-tsconfig-paths"
import { resolve } from "path"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  // Use parent directory as root to access index.html and src/
  root: resolve(__dirname, ".."),
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: resolve(__dirname, "../tailwind.config.js")
        }),
        autoprefixer()
      ]
    }
  },
  plugins: [
    tsconfigPaths({
      root: resolve(__dirname, "..")
    }),
    react(),
    nodePolyfills({
      // Exclude electron-specific modules for web build
      exclude: ["electron"] as any
    })
  ],
  resolve: {
    alias: [
      { find: /^~/, replacement: resolve(__dirname, "../src") + "/" },
      // Exclude electron key-store for web
      {
        find: /^.*\/platform\/electron\/key-store$/,
        replacement: resolve(__dirname, "../src/Platform/key-store.ts")
      },
      // Replace deprecated built-in punycode with userland version
      { find: /^punycode$/, replacement: "punycode/" }
    ]
  },
  define: {
    // Ensure process.browser is true for web builds
    "process.browser": JSON.stringify(true),
    // Don't set PLATFORM for web (or set it to undefined)
    "process.env.PLATFORM": JSON.stringify(undefined)
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["electron", "electron-updater"]
    }
  },
  server: {
    port: 3000,
    strictPort: false
  }
})
