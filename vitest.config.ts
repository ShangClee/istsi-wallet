import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    // Use jsdom environment for React component testing
    environment: "jsdom",

    // Setup files to run before tests
    setupFiles: ["./test/setup.ts"],

    // Global test configuration
    globals: true,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "electron/lib/",
        ".storybook/",
        "**/*.stories.tsx",
        "**/*.d.ts",
        "test/",
        "cordova/",
        "web/"
      ],
      // Target 80%+ coverage as per requirements
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },

    // Test file patterns
    include: ["**/*.{test,spec}.{ts,tsx}"],

    // Exclude patterns
    exclude: ["node_modules", "dist", "electron/lib", ".storybook", "cordova", "web"],

    // Timeout for tests (increased for property-based tests)
    testTimeout: 30000
  },

  resolve: {
    alias: [{ find: /^~/, replacement: path.resolve(__dirname, "./src") + "/" }]
  }
})
