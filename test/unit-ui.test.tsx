import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MainTitle from "../src/Generic/components/MainTitle"

// Mock IPC
vi.mock("~Platform/ipc", () => ({
  call: vi.fn(),
  subscribeToMessages: vi.fn(() => () => {})
}))

describe("Task 12.1: Critical UI Components", () => {
  describe("MainTitle", () => {
    it("should render title correctly", () => {
      render(
        <MainTitle title="Security Settings" onBack={() => {}} />
      )
      expect(screen.getByText("Security Settings")).toBeDefined()
    })

    it("should not render back button when hideBackButton is true", () => {
      render(
        <MainTitle title="Home" hideBackButton={true} onBack={() => {}} />
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
