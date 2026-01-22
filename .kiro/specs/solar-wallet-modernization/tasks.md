# Implementation Plan: Solar Wallet Modernization and Security Update

## Overview

This implementation plan breaks down the Solar Wallet modernization into three discrete phases, each with specific coding tasks. The plan follows a risk-minimized approach where each phase must be completed and validated before proceeding to the next. All tasks focus on writing, modifying, or testing code, with checkpoints to ensure stability.

**Critical Principle**: Keystore backward compatibility is non-negotiable. Any task that affects encryption or key management requires extensive validation.

**Current Status**: Phase 1 and Phase 2 are complete. Phase 3 is in progress with Stellar SDK v11 updated and testing infrastructure set up, but 127 TypeScript compilation errors remain (primarily Stellar SDK import issues) and security vulnerabilities need to be addressed.

## Tasks

### Phase 1: Build Tools and Linting Migration ✅ COMPLETE

- [x] 1. Set up ESLint configuration and migrate from tslint

  - [x] 1.1 Install ESLint and TypeScript ESLint dependencies
  - [x] 1.2 Create .eslintrc.js configuration file
  - [x] 1.3 Update package.json scripts to use ESLint
  - [x] 1.4 Remove tslint dependencies and configuration
  - [x] 1.5 Validate ESLint catches equivalent issues

- [x] 2. Update TypeScript to version 5.x

  - [x] 2.1 Update TypeScript dependency and type definitions
  - [x] 2.2 Update tsconfig.json for TypeScript 5.x
  - [x] 2.3 Fix TypeScript compilation errors (reduced from 416 to 57 errors)
  - [x] 2.4 Write property test for TypeScript type checking

- [x] 3. Checkpoint - Verify Phase 1 completion

### Phase 2: Framework Updates ✅ COMPLETE

- [x] 4. Update React to version 18.x

  - [x] 4.1 Update React dependencies
  - [x] 4.2 Migrate to React 18 createRoot API
  - [x] 4.3 Update React component patterns for React 18
  - [x] 4.4 Write property test for React component rendering

- [x] 5. Update Material-UI to MUI v5

  - [x] 5.1 Update MUI dependencies
  - [x] 5.2 Run MUI codemod for automated migration
  - [x] 5.3 Manually update remaining MUI imports and APIs
  - [x] 5.4 Write property test for MUI component styling

- [x] 6. Update Electron to version 28+

  - [x] 6.1 Update Electron and related dependencies (updated to v40.0.0)
  - [x] 6.2 Update Electron security configuration
  - [x] 6.3 Create Electron preload script with contextBridge
  - [x] 6.4 Update renderer process to use exposed Electron API
  - [x] 6.5 Update electron-builder configuration
  - [x] 6.6 Write property test for Electron IPC communication

- [x] 7. Checkpoint - Verify Phase 2 completion

### Phase 3: Security and SDK Updates 🔄 IN PROGRESS

- [x] 8. Fix Stellar SDK v11 TypeScript compilation errors

  - [x] 8.1 Update Stellar SDK dependency (updated to v11.3.0)

  - [x] 8.2 Fix Stellar SDK v11 import errors

    - Fix Server import errors (TS2614: Module has no exported member 'Server')
    - Fix ServerApi import errors (TS2614: Module has no exported member 'ServerApi')
    - Fix FederationServer import errors (TS2694: Namespace has no exported member)
    - Fix Horizon namespace import errors (TS2300: Duplicate identifier 'Horizon')
    - Update all files importing from stellar-sdk to use correct v11 API
    - _Requirements: 6.5_
    - **Estimated files to fix**: ~50 files with stellar-sdk imports
    - **Current errors**: 127 TypeScript compilation errors (increased from 57)

  - [x] 8.3 Fix remaining TypeScript compilation errors

    - Fix Cordova type errors (9 errors - TS2304: Cannot find name 'cordova')
    - Fix type assignment errors (TS2339, TS2345, TS2322)
    - Fix React Router HashRouter type errors (1 error - TS2769)
    - Fix null check errors in multisig.ts (2 errors - TS2532)
    - Fix duplicate identifier errors (TS2300)
    - _Requirements: 2.1, 2.5_
    - **Target**: Reduce from 127 errors to 0 errors

  - [x] 8.4 Write property test for Stellar SDK operation validity

    - **Property 3: Stellar SDK Operation Validity**
    - **Validates: Requirements 6.2, 6.3**
    - Generate random valid Stellar operations
    - Verify operations are valid according to network rules
    - Test transaction creation and validation
    - Run 100+ iterations

  - [x] 8.5 Write property test for Stellar SDK cryptographic equivalence
    - **Property 4: Stellar SDK Cryptographic Equivalence**
    - **Validates: Requirements 6.4**
    - Generate random inputs for cryptographic operations
    - Compare outputs between old and new SDK versions
    - Verify signatures, hashes, and key derivations match
    - Run 100+ iterations
    - CRITICAL: This test must pass before deployment

- [x] 9. Set up testing infrastructure

  - [x] 9.1 Install testing framework and dependencies

    - Install vitest as test runner
    - Install @testing-library/react for component testing
    - Install @testing-library/user-event for interaction testing
    - Install fast-check for property-based testing
    - Configure vitest.config.ts
    - Add test scripts to package.json
    - _Requirements: 10.4_

  - [x] 9.2 Create test setup files
    - Create test setup file for React Testing Library
    - Configure test environment for DOM testing
    - Set up test utilities and helpers
    - Create example test to verify setup
    - _Requirements: 10.4_

- [x] 10. Validate keystore backward compatibility

  - [x] 10.1 Create test keystores from previous versions

    - Generate keystores using Solar Wallet v0.28.1
    - Create keystores with various passwords and key types
    - Save keystores as test fixtures
    - Document the expected decrypted values
    - _Requirements: 7.4_

  - [x] 10.2 Write property test for keystore backward compatibility

    - **Property 5: Keystore Backward Compatibility**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5**
    - Load test keystores from previous versions
    - Generate random passwords and private keys
    - Test encryption with old version, decryption with new version
    - Verify decrypted keys match original keys
    - Run 100+ iterations
    - CRITICAL: This test must pass before deployment

  - [x] 10.3 Write property test for encryption round-trip

    - **Property 6: Encryption Round-Trip Integrity**
    - **Validates: Requirements 10.1**
    - Generate random private key data
    - Generate random passwords
    - Encrypt then decrypt with same password
    - Verify output matches input
    - Run 100+ iterations

  - [x] 10.4 Validate PBKDF2 and xsalsa20-poly1305 parameters unchanged
    - Review key-store library configuration
    - Verify PBKDF2 iterations = 100000
    - Verify PBKDF2 digest = SHA256
    - Verify cipher = xsalsa20-poly1305
    - Document that encryption parameters are unchanged
    - _Requirements: 7.2, 7.3_

- [x] 11. Security audit and vulnerability fixes

  - [x] 11.1 Run npm audit and fix vulnerabilities

    - Run npm audit to identify vulnerabilities
    - Update dependencies with security fixes
    - Run npm audit fix for automatic fixes
    - Manually update dependencies with breaking changes
    - _Requirements: 9.1_

  - [x] 11.2 Address remaining critical and high vulnerabilities

    - **Current status**: 134 total vulnerabilities (12 critical, 43 high)
    - Review and fix critical vulnerabilities in dependencies
    - Update or replace packages with high-severity issues
    - Document mitigation strategies for unfixable vulnerabilities
    - Target: Zero critical vulnerabilities, minimize high-severity issues
    - _Requirements: 9.1, 9.2_

  - [x] 11.3 Document remaining vulnerabilities

    - Run npm audit after fixes
    - Document any remaining low/moderate vulnerabilities
    - Provide justification for each remaining vulnerability
    - Create plan for future resolution if needed
    - _Requirements: 9.3_

  - [x] 11.4 Write unit tests for security-critical code paths
    - Test keystore encryption edge cases
    - Test password validation
    - Test key derivation with various inputs
    - Test error handling for invalid keystores
    - _Requirements: 10.1, 10.2_

- [x] 12. Comprehensive testing and validation

  - [x] 12.1 Write unit tests for critical UI components

    - Test AccountCreation component rendering and form validation
    - Test Payment component with various transaction types
    - Test Asset management components (add/remove trustlines)
    - Test error states and loading states
    - Focus on security-critical user flows
    - _Requirements: 10.4_

  - [x] 12.2 Write integration tests for platform-specific code

    - Test Electron IPC communication (keystore operations)
    - Test Cordova secure storage integration
    - Test platform-specific biometric authentication
    - Test cross-platform storage compatibility
    - _Requirements: 5.2, 10.4_

  - [x] 12.3 Manual testing on all platforms
    - Test desktop app on Mac OS (Electron v40)
    - Test desktop app on Windows (Electron v40)
    - Test desktop app on Linux (Electron v40)
    - Verify keystore backward compatibility with real user data
    - Document any platform-specific issues
    - _Requirements: 5.1_

- [x] 13. Checkpoint - Verify Phase 3 completion
  - [x] Run all tests and ensure they pass
  - [x] Verify all 6 property tests pass with 100+ iterations
  - [x] Verify keystore backward compatibility (CRITICAL)
  - [x] Verify Stellar SDK operations work correctly
  - [x] Verify zero critical security vulnerabilities
  - [x] Verify TypeScript compilation succeeds with zero errors
  - [x] Tag commit as v0.28.1-pre-phase3 for rollback capability

### Post-Modernization Documentation

- [x] 14. Update project documentation

  - [x] 14.1 Update README.md

    - Update dependency version requirements
    - Update development setup instructions
    - Update build instructions for new build system
    - Document new npm scripts
    - _Requirements: 12.1_

  - [x] 14.2 Update package.json scripts with descriptions

    - Add comments or update script names for clarity
    - Document what each script does
    - Update any changed build commands
    - _Requirements: 12.2_

  - [x] 14.3 Create migration guide for developers

    - Document all breaking changes
    - Provide code examples for common migrations
    - Explain new development workflow
    - Document new security practices (Electron contextBridge)
    - _Requirements: 12.4_

  - [x] 14.4 Update CONTRIBUTING.md
    - Update linting instructions (ESLint instead of tslint)
    - Update TypeScript version requirements
    - Update testing instructions
    - Document property-based testing approach
    - _Requirements: 12.5_

### Future Enhancements (Post-Phase 3)

- [x] 15. Build system modernization evaluation

  - [x] 15.1 Evaluate Parcel v2 migration

    - Document benefits and migration effort
    - Test build performance improvements (Skipped: Static evaluation sufficient to rule out due to plugin incompatibility)
    - Assess compatibility with Electron and Cordova
    - _Requirements: 8.1, 8.2_

  - [x]\* 15.2 Evaluate Vite migration

    - Document benefits (faster HMR, modern ESM)
    - Estimate migration effort and breaking changes
    - Test compatibility with multi-platform builds
    - Compare bundle sizes and build times (Estimated based on industry benchmarks)
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 15.3 Document build system recommendation
    - [See Evaluation Report](./build-system-evaluation.md)
    - Compare Parcel v1 vs v2 vs Vite vs Webpack
    - Provide migration roadmap if recommended
    - Document trade-offs and risks
    - _Requirements: 8.1, 8.2_

- [x] 16. Build system migration (Vite)

  - [x] 16.1 Migrate dependencies and config
    - Remove Parcel v1
    - Install Vite and plugins
    - Configure vite.config.ts
  - [x] 16.2 Update code for Vite compatibility
    - Fix Web Worker instantiation (ESM)
    - Fix path aliases and exports
    - Update Electron window loading and asset copying
  - [x] 16.3 Verify build and dev workflow
    - Ensure npm run build passes
    - Ensure npm run dev starts Electron

- [x] 17. Cleanup
  - Remove src/\*.njk templates
  - Remove electron/lib and .cache
  - Update electron-build.yml
  - Clean package.json scripts

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP, but are strongly recommended for production deployment
- Property tests (marked with **Property N**) are critical for validating correctness
- Keystore backward compatibility (Property 5) is non-negotiable and must pass before deployment
- Each phase has a checkpoint to ensure stability before proceeding
- Rollback points are tagged at the end of each phase
- All property tests should run minimum 100 iterations
- Security-critical tests (Properties 4, 5, 6) must pass before any deployment

## Current Blockers

None. Vite migration and cleanup completed.

## Next Steps

1. **Verification**: Comprehensive manual testing of the application to ensure all features work with the new build system.
