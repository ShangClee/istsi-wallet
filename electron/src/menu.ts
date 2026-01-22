import { app, Menu, MenuItemConstructorOptions } from "electron"

export function createAppMenu() {
  // Create menu for all platforms
  // On macOS it appears in the menu bar, on Windows/Linux it appears in the window

  const macAppMenuItem: MenuItemConstructorOptions = {
    label: app.getName(),
    submenu: [{ label: "About", role: "about" }, { type: "separator" }, { label: "Quit", role: "quit" }]
  }

  const menuTemplate: MenuItemConstructorOptions[] = process.platform === "darwin"
    ? [
        macAppMenuItem,
        {
          // We need those menu items to make the keyboard shortcuts work
          label: "Edit",
          submenu: [
            { role: "undo" },
            { role: "redo" },
            { type: "separator" },
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
            { role: "selectAll" }
          ]
        }
      ]
    : [
        {
          label: "File",
          submenu: [{ role: "quit", label: "Exit" }]
        },
        {
          label: "Edit",
          submenu: [
            { role: "undo" },
            { role: "redo" },
            { type: "separator" },
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
            { role: "selectAll" }
          ]
        },
        {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" }
          ]
        },
        {
          label: "Help",
          submenu: [{ role: "about", label: "About Solar Wallet" }]
        }
      ]

  const appMenu = Menu.buildFromTemplate(menuTemplate)

  return appMenu
}
