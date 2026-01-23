import { BrowserWindow, Menu, nativeImage, shell } from "electron"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let openWindows: BrowserWindow[] = []

// start protocol handler
import * as protocolHandler from "./protocol-handler"
import { Messages } from "./shared/ipc"

export function createMainWindow() {
  if (process.platform !== "darwin") {
    // Need to set menu to null before creating the window
    // See <https://github.com/electron/electron/issues/16521#issuecomment-458035634>
    Menu.setApplicationMenu(null)
  }

  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    title: "Solar Wallet",
    icon: nativeImage.createFromPath(path.join(__dirname, "../build/icon.png")),
    backgroundColor: "#0196E8",
    titleBarStyle: process.platform === "darwin" ? "hidden" : "default",
    webPreferences: {
      contextIsolation: true, // Required for security in Electron 28+
      disableBlinkFeatures: "Auxclick", // prevent middle-click events (see https://git.io/Jeu1K)
      nodeIntegration: false, // Required for security in Electron 28+
      nodeIntegrationInWorker: false,
      preload: path.join(__dirname, "../preload/preload.js"),
      sandbox: false,
      webviewTag: false
    }
  })

  window.removeMenu()

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    window.loadFile(path.join(__dirname, "../../dist/index.html"))
  }

  window.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (!webContents.getURL().startsWith("file://") && (permission === "media" || permission === "openExternal")) {
      return callback(false)
    } else {
      return callback(true)
    }
  })

  // subscribes to window.open and <a target="_blank"></a> links and opens the url in the browser
  window.webContents.on("new-window", (event, url) => {
    event.preventDefault()
    if (window.webContents.getURL().startsWith("file://")) {
      shell.openExternal(url)
    }
  })

  // unlikely to be triggered because we programmatically handle user navigation
  window.webContents.on("will-redirect", (event, url) => {
    // limit navigation flows to unstrusted origins
    if (!window.webContents.getURL().startsWith("file://")) {
      event.preventDefault()
    }
  })

  // subscribe this window to deeplink urls
  const unsubscribe = protocolHandler.subscribe(url => {
    window.webContents.send(Messages.DeepLinkURL, url)
    if (process.platform === "linux") {
      // needed for minimized windows to come to the foreground
      window.minimize()
      window.restore()
      window.focus()
    }
    window.show()
  })

  // unsubscribe on window close
  window.on("closed", () => {
    protocolHandler.windowDestroyed()
    unsubscribe()
  })

  window.webContents.on("did-finish-load", () => {
    protocolHandler.windowReady()
  })

  return window
}

export function getOpenWindows() {
  return openWindows
}

// Keep a global reference of the window object. If you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export function trackWindow(window: BrowserWindow) {
  openWindows.push(window)

  window.on("closed", () => {
    openWindows = openWindows.filter(someWindow => someWindow !== window)
  })

  return window
}
