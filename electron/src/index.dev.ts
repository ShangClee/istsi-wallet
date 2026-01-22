import path from "path"
import { fileURLToPath } from "url"
import "./app"

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
  // Use dynamic import for electron-reload to handle it safely in ESM/TS environment
  import("electron-reload")
    .then(module => {
      const autoReload = module.default || module
      // Verify autoReload is a function
      if (typeof autoReload === "function") {
        const watch = path.join(__dirname, "..", "..", "dist", "*")
        autoReload(watch, {
          electron: path.join(__dirname, "..", "..", "node_modules", ".bin", "electron")
        })
      } else {
        console.warn("electron-reload loaded but is not a function:", autoReload)
      }
    })
    .catch(e => {
      console.error("Failed to load electron-reload:", e)
    })
} catch (e) {
  console.error("Failed to setup electron-reload:", e)
}
