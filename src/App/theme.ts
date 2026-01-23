// Theme file - MUI removed, only constants and utilities remain

// MUI v5 uses createTheme instead of createMuiTheme
// breakpoints are now accessed via theme.breakpoints
const createBreakpoints = () => {
  return {
    keys: ["xs", "sm", "md", "lg", "xl"] as const,
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    up: (key: number | "xs" | "sm" | "md" | "lg" | "xl") =>
      `@media (min-width:${typeof key === "number" ? key : { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[key]}px)`,
    down: (key: number | "xs" | "sm" | "md" | "lg" | "xl") =>
      `@media (max-width:${
        typeof key === "number" ? key - 0.05 : { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[key] - 0.05
      }px)`,
    between: (start: "xs" | "sm" | "md" | "lg" | "xl", end: "xs" | "sm" | "md" | "lg" | "xl") => "",
    only: (key: "xs" | "sm" | "md" | "lg" | "xl") => "",
    unit: "px" as const
  }
}

// TODO: The dark and light derivation of the brand color have not been design-reviewed!
export const brandColor = {
  dark: "#0290c0",
  main: "#02b8f5",
  main15: "#02b8f526",
  light: "#72dbfe"
}

export const primaryBackground = "linear-gradient(to left bottom, #01B3F3, #0176DC)"
export const primaryBackgroundColor = "#0194E7"

export const warningColor = "#ffc107" // amber 500 equivalent

export const breakpoints = createBreakpoints()

// MUI theme object removed - no longer needed
// Transition components are now exported directly from Generic/components/Transitions
export { SlideLeftTransition as FullscreenDialogTransition, SlideUpTransition as CompactDialogTransition } from "../Generic/components/Transitions"

const initialScreenHeight = window.screen.height

// CSS media query selector to detect an open keyboard on iOS + Android
export const MobileKeyboardOpenedSelector =
  process.env.PLATFORM === "ios" || process.env.PLATFORM === "android"
    ? () => `@media (max-height: ${initialScreenHeight - 100}px)`
    : () => `:not(*)`
