import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MainTitle from "../src/Generic/components/MainTitle"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Mock IPC
vi.mock("~Platform/ipc", () => ({
  call: vi.fn(),
  subscribeToMessages: vi.fn(() => () => {})
}))

const theme = createTheme()

describe("Task 12.1: Critical UI Components", () => {
  describe("MainTitle", () => {
    it("should render title correctly", () => {
      render(
        <ThemeProvider theme={theme}>
          <MainTitle title="Security Settings" onBack={() => {}} />
        </ThemeProvider>
      )
      expect(screen.getByText("Security Settings")).toBeDefined()
    })

    it("should not render back button when hideBackButton is true", () => {
      render(
        <ThemeProvider theme={theme}>
          <MainTitle title="Home" hideBackButton={true} onBack={() => {}} />
        </ThemeProvider>
      )
      // Check for back button icon or text existence - specific selector depends on implementation
      // Assuming ArrowBack icon is used
      expect(screen.queryByRole("button")).toBeNull()
      // If the only button is the back button, it should be null.
      // If there are other buttons, we'd need a more specific query.
      // Based on MainTitle implementation, let's assume it's the main interactive element.
    })
  })
})
