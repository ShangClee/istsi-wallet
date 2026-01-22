import { app } from "electron"

// Suppress punycode deprecation warning
// The built-in punycode module is deprecated in Node.js, but some dependencies still use it.
// We've added punycode to package.json overrides to ensure userland version is used where possible.
// This warning filter suppresses the remaining deprecation warning until all dependencies migrate.
const originalEmit = process.emit
process.emit = function (event: string | symbol, ...args: any[]) {
  if (event === "warning") {
    const warning = args[0] as NodeJS.ErrnoException
    if (warning?.name === "DeprecationWarning" && warning?.message?.includes("punycode")) {
      // Suppress punycode deprecation warnings
      return false
    }
  }
  return originalEmit.apply(process, [event, ...args] as [string | symbol, ...any[]])
}

// Quick-fix for "io.solarwallet.app" being shown in Mac app menu
app.name = "Solar Wallet"

// Needs to match the value in electron-build.yml
app.setAppUserModelId("io.solarwallet.app")

// Disabled until we actually ship SEP-7 support
// app.setAsDefaultProtocolClient("web+stellar")
