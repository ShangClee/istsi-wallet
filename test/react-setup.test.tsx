import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

// Simple test component
function TestButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Click me</button>
}

describe("React Testing Library Setup", () => {
  it("should render React components", () => {
    const handleClick = () => {}
    render(<TestButton onClick={handleClick} />)

    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("should support user interactions", async () => {
    let clicked = false
    const handleClick = () => {
      clicked = true
    }

    render(<TestButton onClick={handleClick} />)

    const button = screen.getByText("Click me")
    await userEvent.click(button)

    expect(clicked).toBe(true)
  })
})
