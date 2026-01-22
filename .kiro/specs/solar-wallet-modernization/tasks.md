# Implementation Plan: Solar Wallet Modernization and Security Update

## Overview

This implementation plan breaks down the Solar Wallet modernization into three discrete phases, each with specific coding tasks. The plan follows a risk-minimized approach where each phase must be completed and validated before proceeding to the next. All tasks focus on writing, modifying, or testing code, with checkpoints to ensure stability.

**Critical Principle**: Keystore backward compatibility is non-negotiable. Any task that affects encryption or key management requires extensive validation.

## Tasks

### Phase 1: Build Tools and Linting Migration

- [x] 1. Set up ESLint configuration and migrate from tslint

  - [x] 1.1 Install ESLint and TypeScript ESLint dependencies

    - Install @typescript-eslint/parser, @typescript-eslint/eslint-plugin
    - Install eslint-plugin-react, eslint-plugin-react-hooks
    - Install eslint-config-prettier to maintain Prettier compatibility
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Create .eslintrc.js configuration file

    - Use tslint-to-eslint-config tool for initial conversion
    - Configure parser as @typescript-eslint/parser
    - Set up extends array with recommended configs
    - Migrate tslint rules to equivalent ESLint rules
    - Configure plugins for React and React Hooks
    - _Requirements: 1.2, 1.5_

  - [x] 1.3 Update package.json scripts to use ESLint

    - Replace tslint commands with eslint commands
    - Update lint:fix script to use eslint --fix
    - Update test script to run eslint instead of tslint
    - _Requirements: 1.4_

  - [x] 1.4 Remove tslint dependencies and configuration

    - Remove tslint and tslint-config-prettier from package.json
    - Delete tslint.json configuration file
    - Run npm install to clean up dependencies
    - _Requirements: 1.3_

  - [ ]\* 1.5 Validate ESLint catches equivalent issues
    - Run ESLint on codebase and compare output with previous tslint results
    - Verify all previous errors are still caught
    - Document any rule differences
    - _Requirements: 1.2_

- [x] 2. Update TypeScript to version 5.x

  - [x] 2.1 Update TypeScript dependency and type definitions

    - Update typescript to latest 5.x version in package.json
    - Update all @types/\* packages to compatible versions
    - Update ts-node and ts-loader to compatible versions
    - Run npm install
    - _Requirements: 2.1, 2.4_

  - [x] 2.2 Update tsconfig.json for TypeScript 5.x

    - Update target to "ES2020"
    - Update lib to ["ES2020", "DOM"]
    - Update moduleResolution to "bundler"
    - Update jsx to "react-jsx" for React 18 compatibility
    - Maintain strict: true and existing path configurations
    - _Requirements: 2.2_

  - [x] 2.3 Fix TypeScript compilation errors

    - Run tsc and identify all compilation errors
    - Fix type errors revealed by stricter TS 5.x checking
    - Update code for any breaking changes in TS 5.x
    - Ensure all files compile successfully
    - _Requirements: 2.1, 2.5_

  - [ ]\* 2.4 Write property test for TypeScript type checking
    - **Property: Type error detection**
    - **Validates: Requirements 2.3**
    - Create test that introduces known type errors
    - Verify TypeScript compilation fails for type errors
    - Verify compilation succeeds for valid code

- [-] 3. Checkpoint - Verify Phase 1 completion
  - Ensure all tests pass, ask the user if questions arise.
  - Verify ESLint runs successfully on all TypeScript files
  - Verify TypeScript compiles without errors
  - Tag commit as v0.28.1-pre-phase1 for rollback capability

### Phase 2: Framework Updates

- [~] 4. Update React to version 18.x

  - [~] 4.1 Update React dependencies

    - Update react to 18.x in package.json
    - Update react-dom to matching 18.x version
    - Update @types/react and @types/react-dom to 18.x
    - Update react-router and react-router-dom to compatible versions
    - Update all React-related libraries (react-spring, react-window, etc.)
    - Run npm install
    - _Requirements: 3.1, 3.2, 3.4_

  - [~] 4.2 Migrate to React 18 createRoot API

    - Find all ReactDOM.render() calls in src/index.\*.njk files
    - Replace with ReactDOM.createRoot() and root.render()
    - Update type definitions for root element
    - _Requirements: 3.3_

  - [~] 4.3 Update React component patterns for React 18

    - Search for deprecated lifecycle methods (componentWillMount, etc.)
    - Replace with React 18 compatible patterns
    - Update any usage of deprecated React APIs
    - Ensure all components use functional components or proper class components
    - _Requirements: 3.5_

  - [ ]\* 4.4 Write property test for React component rendering
    - **Property 1: UI Component Rendering Integrity**
    - **Validates: Requirements 3.1**
    - Test that all components render without errors
    - Use fast-check to generate random props
    - Verify no console errors during rendering
    - Run 100+ iterations per component

- [~] 5. Update Material-UI to MUI v5

  - [~] 5.1 Update MUI dependencies

    - Replace @material-ui/core with @mui/material
    - Replace @material-ui/icons with @mui/icons-material
    - Install @mui/styles for migration compatibility
    - Install @emotion/react and @emotion/styled (MUI v5 styling)
    - Update storybook-addon-material-ui to compatible version
    - Run npm install
    - _Requirements: 4.1, 4.2_

  - [~] 5.2 Run MUI codemod for automated migration

    - Install @mui/codemod globally or as dev dependency
    - Run codemod for preset-safe transformations
    - Run codemod for theme-spacing transformation
    - Run codemod for variant-prop transformation
    - Review and commit automated changes
    - _Requirements: 4.4_

  - [~] 5.3 Manually update remaining MUI imports and APIs

    - Search for remaining @material-ui imports
    - Update to @mui/material or @mui/icons-material
    - Update makeStyles usage to styled or sx prop
    - Update theme customizations for MUI v5 API
    - Fix any component API breaking changes
    - _Requirements: 4.4, 4.5_

  - [ ]\* 5.4 Write property test for MUI component styling
    - **Property 1: UI Component Rendering Integrity** (continued)
    - **Validates: Requirements 4.1**
    - Test that all MUI components render with correct styling
    - Verify theme is applied correctly
    - Check that styled components work as expected

- [~] 6. Update Electron to version 28+

  - [~] 6.1 Update Electron and related dependencies

    - Update electron to version 28.x or latest stable
    - Update electron-builder to compatible version
    - Update electron-store, electron-debug, electron-context-menu
    - Update electron-notarize for Mac code signing
    - Run npm install
    - _Requirements: 5.1, 5.4_

  - [~] 6.2 Update Electron security configuration

    - Update BrowserWindow webPreferences in electron/src/index.\*.ts
    - Set contextIsolation: true
    - Set nodeIntegration: false
    - Add preload script path
    - _Requirements: 5.3_

  - [~] 6.3 Create Electron preload script with contextBridge

    - Create electron/src/preload.ts
    - Import contextBridge and ipcRenderer
    - Expose secure API using contextBridge.exposeInMainWorld
    - Define interfaces for all IPC methods (signTransaction, getKeystore, etc.)
    - _Requirements: 5.3_

  - [~] 6.4 Update renderer process to use exposed Electron API

    - Update src/Platform/ipc/web.ts to use window.electronAPI
    - Remove direct ipcRenderer usage from renderer
    - Update all IPC calls to use the secure bridge
    - Update TypeScript types for window.electronAPI
    - _Requirements: 5.3, 5.5_

  - [~] 6.5 Update electron-builder configuration

    - Update electron-build.yml for Electron 28 compatibility
    - Verify build configuration for all platforms (Mac, Windows, Linux)
    - Update any deprecated electron-builder options
    - _Requirements: 5.4_

  - [ ]\* 6.6 Write property test for Electron IPC communication
    - **Property 2: Electron IPC Communication Preservation**
    - **Validates: Requirements 5.2**
    - Test that all IPC messages are delivered correctly
    - Generate random IPC payloads
    - Verify responses match expected format
    - Run 100+ iterations

- [~] 7. Checkpoint - Verify Phase 2 completion
  - Ensure all tests pass, ask the user if questions arise.
  - Verify React 18 app renders correctly
  - Verify MUI v5 components display properly
  - Verify Electron app launches on all platforms
  - Test IPC communication works correctly
  - Tag commit as v0.28.1-pre-phase2 for rollback capability

### Phase 3: Security and SDK Updates

- [~] 8. Update Stellar SDK to version 11+

  - [~] 8.1 Update Stellar SDK dependency

    - Update stellar-sdk to version 11.x or latest stable
    - Update @types/stellar-base if needed
    - Update @satoshipay/stellar-sep-10 and @satoshipay/stellar-transfer
    - Run npm install
    - _Requirements: 6.1_

  - [~] 8.2 Update Stellar SDK API usage

    - Review Stellar SDK v11 changelog for breaking changes
    - Update transaction building code for API changes
    - Update Horizon server interaction code
    - Update account operation code (payments, trust lines, offers)
    - Ensure all SDK usage compiles without errors
    - _Requirements: 6.5_

  - [ ]\* 8.3 Write property test for Stellar SDK operation validity

    - **Property 3: Stellar SDK Operation Validity**
    - **Validates: Requirements 6.2, 6.3**
    - Generate random valid Stellar operations
    - Verify operations are valid according to network rules
    - Test transaction creation and validation
    - Run 100+ iterations

  - [ ]\* 8.4 Write property test for Stellar SDK cryptographic equivalence
    - **Property 4: Stellar SDK Cryptographic Equivalence**
    - **Validates: Requirements 6.4**
    - Generate random inputs for cryptographic operations
    - Compare outputs between old and new SDK versions
    - Verify signatures, hashes, and key derivations match
    - Run 100+ iterations
    - CRITICAL: This test must pass before deployment

- [~] 9. Validate keystore backward compatibility

  - [~] 9.1 Create test keystores from previous versions

    - Generate keystores using Solar Wallet v0.28.1
    - Create keystores with various passwords and key types
    - Save keystores as test fixtures
    - Document the expected decrypted values
    - _Requirements: 7.4_

  - [ ]\* 9.2 Write property test for keystore backward compatibility

    - **Property 5: Keystore Backward Compatibility**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5**
    - Load test keystores from previous versions
    - Generate random passwords and private keys
    - Test encryption with old version, decryption with new version
    - Verify decrypted keys match original keys
    - Run 100+ iterations
    - CRITICAL: This test must pass before deployment

  - [ ]\* 9.3 Write property test for encryption round-trip

    - **Property 6: Encryption Round-Trip Integrity**
    - **Validates: Requirements 10.1**
    - Generate random private key data
    - Generate random passwords
    - Encrypt then decrypt with same password
    - Verify output matches input
    - Run 100+ iterations

  - [~] 9.4 Validate PBKDF2 and xsalsa20-poly1305 parameters unchanged
    - Review key-store library configuration
    - Verify PBKDF2 iterations = 100000
    - Verify PBKDF2 digest = SHA256
    - Verify cipher = xsalsa20-poly1305
    - Document that encryption parameters are unchanged
    - _Requirements: 7.2, 7.3_

- [~] 10. Security audit and vulnerability fixes

  - [~] 10.1 Run npm audit and fix vulnerabilities

    - Run npm audit to identify vulnerabilities
    - Update dependencies with security fixes
    - Run npm audit fix for automatic fixes
    - Manually update dependencies with breaking changes
    - _Requirements: 9.1_

  - [~] 10.2 Document remaining vulnerabilities

    - Run npm audit after fixes
    - Document any remaining low/moderate vulnerabilities
    - Provide justification for each remaining vulnerability
    - Create plan for future resolution if needed
    - _Requirements: 9.3_

  - [ ]\* 10.3 Write unit tests for security-critical code paths
    - Test keystore encryption edge cases
    - Test password validation
    - Test key derivation with various inputs
    - Test error handling for invalid keystores
    - _Requirements: 10.1, 10.2_

- [~] 11. Comprehensive testing and validation

  - [ ]\* 11.1 Write unit tests for UI components

    - Test component rendering with various props
    - Test user interactions (clicks, form submissions)
    - Test error states and loading states
    - Achieve 80%+ code coverage for UI components
    - _Requirements: 10.4_

  - [ ]\* 11.2 Write integration tests for platform-specific code

    - Test Electron main process functionality
    - Test Cordova plugin integration
    - Test platform-specific storage mechanisms
    - Test IPC communication end-to-end
    - _Requirements: 5.2, 10.4_

  - [~] 11.3 Manual testing on all platforms
    - Test desktop app on Mac OS
    - Test desktop app on Windows
    - Test desktop app on Linux
    - Document any platform-specific issues
    - _Requirements: 5.1_

- [~] 12. Checkpoint - Verify Phase 3 completion
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all 6 property tests pass with 100+ iterations
  - Verify keystore backward compatibility (CRITICAL)
  - Verify Stellar SDK operations work correctly
  - Verify no high/critical security vulnerabilities
  - Tag commit as v0.28.1-pre-phase3 for rollback capability

### Post-Modernization Documentation

- [~] 13. Update project documentation

  - [~] 13.1 Update README.md

    - Update dependency version requirements
    - Update development setup instructions
    - Update build instructions for new build system
    - Document new npm scripts
    - _Requirements: 12.1_

  - [~] 13.2 Update package.json scripts with descriptions

    - Add comments or update script names for clarity
    - Document what each script does
    - Update any changed build commands
    - _Requirements: 12.2_

  - [~] 13.3 Create migration guide for developers

    - Document all breaking changes
    - Provide code examples for common migrations
    - Explain new development workflow
    - Document new security practices (Electron contextBridge)
    - _Requirements: 12.4_

  - [~] 13.4 Update CONTRIBUTING.md
    - Update linting instructions (ESLint instead of tslint)
    - Update TypeScript version requirements
    - Update testing instructions
    - Document property-based testing approach
    - _Requirements: 12.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP, but are strongly recommended for production deployment
- Property tests (marked with **Property N**) are critical for validating correctness
- Keystore backward compatibility (Property 5) is non-negotiable and must pass before deployment
- Each phase has a checkpoint to ensure stability before proceeding
- Rollback points are tagged at the end of each phase
- All property tests should run minimum 100 iterations
- Security-critical tests (Properties 4, 5, 6) must pass before any deployment
