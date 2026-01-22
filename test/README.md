# Testing Infrastructure

This directory contains the testing infrastructure setup for Solar Wallet.

## Testing Framework

- **Vitest**: Fast unit test framework with native TypeScript support
- **React Testing Library**: Testing utilities for React components
- **User Event**: Simulates user interactions
- **fast-check**: Property-based testing library
- **jsdom**: DOM implementation for Node.js

## Test Scripts

### Run all tests once

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with UI

```bash
npm run test:ui
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run only property-based tests

```bash
npm run test:pbt
```

## Writing Tests

### Unit Tests

Create test files with `.test.ts` or `.test.tsx` extension:

```typescript
import { describe, it, expect } from "vitest"

describe("MyComponent", () => {
  it("should do something", () => {
    expect(true).toBe(true)
  })
})
```

### React Component Tests

```typescript
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

describe("MyComponent", () => {
  it("should render", () => {
    render(<MyComponent />)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })
})
```

### Property-Based Tests

Property-based tests should be tagged with the property number and description:

```typescript
import fc from "fast-check"

describe("Property 5: Keystore Backward Compatibility", () => {
  it("should decrypt legacy keystores", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 8 }), password => {
        // Test property
        return true
      }),
      { numRuns: 100 }
    )
  })
})
```

## Coverage Requirements

- **Minimum Coverage**: 80% statement coverage
- **Critical Paths**: 100% coverage for keystore and cryptographic operations
- **Property Tests**: All 6 correctness properties must have property-based tests

## Configuration

- `vitest.config.ts`: Main Vitest configuration
- `test/setup.ts`: Test setup file (runs before all tests)

## Test Organization

- `test/`: Test infrastructure and setup tests
- `src/**/*.test.ts(x)`: Co-located unit tests with source files
- Property-based tests should be tagged with: `Property {number}: {description}`
