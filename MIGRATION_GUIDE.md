# Solar Wallet Modernization Migration Guide

This guide documents all breaking changes introduced during the Solar Wallet modernization from v0.28.0 to v0.28.1 and provides migration instructions for developers.

## Table of Contents

- [Overview](#overview)
- [Phase 1: Build Tools and Linting](#phase-1-build-tools-and-linting)
- [Phase 2: Framework Updates](#phase-2-framework-updates)
- [Phase 3: Security and SDK Updates](#phase-3-security-and-sdk-updates)
- [Development Workflow Changes](#development-workflow-changes)
- [Testing Changes](#testing-changes)
- [Security Best Practices](#security-best-practices)

## Overview

The Solar Wallet modernization was executed in three phases to minimize risk while updating critical dependencies:

- **Phase 1**: Build tools and linting migration (tslint → ESLint, TypeScript 3.7 → 5.7)
- **Phase 2**: Framework updates (React 16 → 18, Material-UI v4 → MUI v5, Electron 19 → 40)
- **Phase 3**: Security and SDK updates (Stellar SDK v9 → v11, security audits)

**Critical**: Keystore backward compatibility is maintained. All existing encrypted keystores remain accessible.

## Phase 1: Build Tools and Linting

### TypeScript 5.7 Migration

**Breaking Changes:**

1. **Stricter Type Checking**: TypeScript 5.7 has stricter type inference and checking
2. **Module Resolution**: New `bundler` module resolution mode
3. **JSX Transform**: Updated to use React 18's automatic JSX runtime

**Migration Steps:**

```typescript
// Old tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["ES6", "DOM"],
    "jsx": "react"
  }
}

// New tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",  // Automatic JSX runtime
    "moduleResolution": "bundler"
  }
}
```

**Code Changes Required:**

```typescript
// Old: Manual React import required
import React from "react"

function MyComponent() {
  return <div>Hello</div>
}

// New: React import optional (automatic JSX runtime)
function MyComponent() {
  return <div>Hello</div>
}
```

### ESLint Migration (from tslint)

**Breaking Changes:**

1. **Configuration Format**: `.eslintrc.js` instead of `tslint.json`
2. **Rule Names**: Different rule naming conventions
3. **Plugin System**: ESLint uses plugins instead of tslint's built-in rules

**Migration Steps:**

```bash
# Remove tslint
npm uninstall tslint

# Install ESLint
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuration Changes:**

```javascript
// .eslintrc.js
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    // Custom rules
  }
}
```

**Command Changes:**

```bash
# Old
npm run tslint

# New
npm run lint
npm run lint:fix  # Auto-fix issues
```

## Phase 2: Framework Updates

### React 18 Migration

**Breaking Changes:**

1. **Root API**: `ReactDOM.render` replaced with `createRoot`
2. **Automatic Batching**: State updates are automatically batched
3. **Strict Mode**: More aggressive checks in development

**Migration Steps:**

```typescript
// Old (React 16)
import ReactDOM from "react-dom"

ReactDOM.render(<App />, document.getElementById("root"))

// New (React 18)
import { createRoot } from "react-dom/client"

const root = createRoot(document.getElementById("root")!)
root.render(<App />)
```

**Type Definition Updates:**

```typescript
// Old
import { FC } from "react"

const MyComponent: FC<Props> = ({ children }) => {
  return <div>{children}</div>
}

// New (React 18 - children not implicit)
import { FC, ReactNode } from "react"

interface Props {
  children?: ReactNode // Must be explicit
}

const MyComponent: FC<Props> = ({ children }) => {
  return <div>{children}</div>
}
```

### Material-UI v5 (MUI) Migration

**Breaking Changes:**

1. **Package Names**: `@material-ui/*` → `@mui/*`
2. **Styling System**: JSS → Emotion
3. **Theme Structure**: Updated theme API
4. **Component Props**: Some prop names changed

**Migration Steps:**

```bash
# Install codemod tool
npm install --save-dev @mui/codemod

# Run automated migration
npx @mui/codemod v5.0.0/preset-safe .
```

**Import Changes:**

```typescript
// Old
import { Button, TextField } from "@material-ui/core"
import { Add, Delete } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles"

// New
import { Button, TextField } from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
```

**Styling Changes:**

```typescript
// Old (makeStyles with JSS)
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  }
}))

function MyComponent() {
  const classes = useStyles()
  return <div className={classes.root}>Content</div>
}

// New (styled with Emotion)
import { styled } from "@mui/material/styles"

const Root = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main
}))

function MyComponent() {
  return <Root>Content</Root>
}

// Alternative: sx prop
import { Box } from "@mui/material"

function MyComponent() {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "primary.main"
      }}
    >
      Content
    </Box>
  )
}
```

**Theme Changes:**

```typescript
// Old
import { createMuiTheme } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#1976d2" }
  }
})

// New
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }
  }
})
```

### Electron 40 Migration

**Breaking Changes:**

1. **Context Isolation**: Now required for security
2. **Node Integration**: Must be disabled in renderer
3. **IPC Communication**: Must use contextBridge
4. **Security**: Stricter Content Security Policy

**Migration Steps:**

**1. Update Main Process Window Configuration:**

```typescript
// Old (Electron 19)
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})

// New (Electron 40)
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false, // Disabled for security
    contextIsolation: true, // Required for security
    preload: path.join(__dirname, "preload.js")
  }
})
```

**2. Create Preload Script with contextBridge:**

```typescript
// preload.js
import { contextBridge, ipcRenderer } from "electron"

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld("electronAPI", {
  // IPC methods
  signTransaction: (tx: string) => ipcRenderer.invoke("sign-transaction", tx),
  getKeystore: () => ipcRenderer.invoke("get-keystore"),

  // Event listeners
  onUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on("update-available", callback)
  }
})
```

**3. Update Renderer Process:**

```typescript
// Old (Direct Node.js access)
import { ipcRenderer } from "electron"

const result = await ipcRenderer.invoke("sign-transaction", tx)

// New (Via exposed API)
declare global {
  interface Window {
    electronAPI: {
      signTransaction: (tx: string) => Promise<string>
      getKeystore: () => Promise<Keystore>
      onUpdateAvailable: (callback: () => void) => void
    }
  }
}

const result = await window.electronAPI.signTransaction(tx)
```

**4. Type Definitions:**

```typescript
// shared/types/electron.d.ts
export interface ElectronAPI {
  signTransaction: (tx: string) => Promise<string>
  getKeystore: () => Promise<Keystore>
  onUpdateAvailable: (callback: () => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
```

## Phase 3: Security and SDK Updates

### Stellar SDK v11 Migration

**Breaking Changes:**

1. **Import Structure**: Some exports reorganized
2. **API Changes**: Updated method signatures
3. **Type Definitions**: Improved TypeScript types

**Migration Steps:**

```typescript
// Old (Stellar SDK v9)
import { Server, Keypair, Transaction, Networks } from "stellar-sdk"

const server = new Server("https://horizon.stellar.org")

// New (Stellar SDK v11)
import { Horizon, Keypair, Transaction, Networks } from "stellar-sdk"

const server = new Horizon.Server("https://horizon.stellar.org")
```

**Common API Changes:**

```typescript
// Transaction building (check for specific changes in your code)
// Most transaction building APIs remain compatible
// Verify signatures and transaction creation produce identical results

// Old
const transaction = new Transaction(envelope, Networks.PUBLIC)

// New (verify compatibility)
const transaction = new Transaction(envelope, Networks.PUBLIC)
```

**Validation Required:**

After migrating to Stellar SDK v11, you MUST validate:

1. Transaction creation produces valid transactions
2. Signatures match previous SDK version for same inputs
3. Network communication works correctly
4. All account operations function properly

### Security Updates

**Key Points:**

1. **Keystore Encryption**: NO CHANGES - backward compatibility maintained
2. **PBKDF2 Parameters**: Unchanged (100,000 iterations, SHA256)
3. **Cipher**: Unchanged (xsalsa20-poly1305)
4. **Dependency Vulnerabilities**: All high/critical vulnerabilities resolved

**Verification:**

```typescript
// Keystore parameters remain unchanged
interface KeyStoreConfig {
  kdf: "pbkdf2"
  kdfParams: {
    iterations: 100000 // Unchanged
    digest: "sha256" // Unchanged
  }
  cipher: "xsalsa20-poly1305" // Unchanged
}
```

## Development Workflow Changes

### New Testing Infrastructure

**Vitest (replaces Jest):**

```bash
# Run tests
npm test                 # Run once
npm run test:watch       # Watch mode
npm run test:ui          # UI mode
npm run test:coverage    # With coverage
npm run test:pbt         # Property-based tests only
```

**Property-Based Testing:**

```typescript
import fc from "fast-check"
import { describe, it } from "vitest"

describe("Property 5: Keystore Backward Compatibility", () => {
  it("should decrypt legacy keystores", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 8 }), fc.string({ minLength: 32 }), (password, privateKey) => {
        const keystore = createKeystore(privateKey, password)
        const decrypted = decryptKeystore(keystore, password)
        return decrypted === privateKey
      }),
      { numRuns: 100 }
    )
  })
})
```

### Updated Linting Workflow

```bash
# Check for errors
npm run lint

# Auto-fix errors
npm run lint:fix

# Format code
npm run prettier
```

### Build Process

The build process remains largely unchanged (Parcel v1.12.4):

```bash
# Development
npm run dev

# Production builds
npm run build:mac
npm run build:win
npm run build:linux
```

## Testing Changes

### Test Framework Migration

**Old (Jest):**

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

**New (Vitest):**

```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### Test File Structure

```typescript
// Old (Jest)
import { render } from "@testing-library/react"

describe("MyComponent", () => {
  test("renders correctly", () => {
    const { getByText } = render(<MyComponent />)
    expect(getByText("Hello")).toBeInTheDocument()
  })
})

// New (Vitest) - mostly compatible
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"

describe("MyComponent", () => {
  it("renders correctly", () => {
    const { getByText } = render(<MyComponent />)
    expect(getByText("Hello")).toBeInTheDocument()
  })
})
```

### Property-Based Testing

New property-based tests using fast-check:

```typescript
import fc from "fast-check"
import { describe, it } from "vitest"

describe("Property Test Example", () => {
  it("should maintain encryption round-trip integrity", () => {
    fc.assert(
      fc.property(fc.string(), fc.string({ minLength: 8 }), (data, password) => {
        const encrypted = encrypt(data, password)
        const decrypted = decrypt(encrypted, password)
        return decrypted === data
      }),
      { numRuns: 100 }
    )
  })
})
```

## Security Best Practices

### Electron Security

**1. Always Use Context Isolation:**

```typescript
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true, // REQUIRED
    nodeIntegration: false // REQUIRED
  }
})
```

**2. Validate All IPC Messages:**

```typescript
// Main process
ipcMain.handle("sign-transaction", async (event, tx: string) => {
  // Validate input
  if (typeof tx !== "string" || !tx) {
    throw new Error("Invalid transaction")
  }

  // Process safely
  return signTransaction(tx)
})
```

**3. Use Content Security Policy:**

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
```

### Keystore Security

**Critical Rules:**

1. **Never modify encryption parameters** - breaks backward compatibility
2. **Always validate passwords** before attempting decryption
3. **Use secure password derivation** (PBKDF2 with 100,000 iterations)
4. **Store keystores securely** on local filesystem only

### Dependency Security

**Regular Audits:**

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Review remaining issues
npm audit --json
```

## Common Migration Issues

### Issue 1: TypeScript Compilation Errors

**Problem:** Stricter type checking in TypeScript 5.7

**Solution:**

```typescript
// Add explicit types
const value: string | undefined = getValue()

// Use type guards
if (value !== undefined) {
  // Use value safely
}
```

### Issue 2: React 18 Children Prop

**Problem:** `children` no longer implicit in FC type

**Solution:**

```typescript
interface Props {
  children?: ReactNode // Add explicitly
}
```

### Issue 3: MUI Styling Not Working

**Problem:** makeStyles removed in MUI v5

**Solution:**

```typescript
// Use styled or sx prop instead
import { styled } from "@mui/material/styles"

const StyledDiv = styled("div")(({ theme }) => ({
  padding: theme.spacing(2)
}))
```

### Issue 4: Electron IPC Not Working

**Problem:** Direct IPC access removed for security

**Solution:**

```typescript
// Use contextBridge in preload script
contextBridge.exposeInMainWorld("electronAPI", {
  myMethod: () => ipcRenderer.invoke("my-method")
})
```

## Rollback Procedure

If critical issues arise, rollback to previous stable version:

```bash
# Rollback to pre-Phase 3
git checkout v0.28.1-pre-phase3

# Rollback to pre-Phase 2
git checkout v0.28.1-pre-phase2

# Rollback to pre-Phase 1
git checkout v0.28.1-pre-phase1

# Restore dependencies
rm -rf node_modules
npm install
```

## Additional Resources

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [MUI v5 Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [TypeScript 5.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

## Support

For issues or questions:

1. Check this migration guide
2. Review the [CONTRIBUTING.md](./CONTRIBUTING.md) file
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** January 2026  
**Version:** 0.28.1
