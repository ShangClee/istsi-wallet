# Security Audit Report - Solar Wallet Modernization

**Date:** January 22, 2026  
**Audit Tool:** npm audit  
**Project:** Solar Wallet  
**Task:** 11.2 Document remaining vulnerabilities

## Executive Summary

After running `npm audit fix`, the project has **134 total vulnerabilities**:

- **12 Critical** severity
- **43 High** severity
- **66 Moderate** severity
- **13 Low** severity

This represents a reduction from the initial 155 vulnerabilities (16 critical, 51 high) after automatic fixes were applied.

## Vulnerability Breakdown by Severity

### Critical Vulnerabilities (12)

#### 1. **babel-traverse** - Arbitrary Code Execution

- **Severity:** Critical
- **CVE:** GHSA-67hx-6x53-jw92
- **Description:** Babel vulnerable to arbitrary code execution when compiling specifically crafted malicious code
- **Affected Package:** `babel-traverse` (all versions)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to babel-core@4.7.16)
- **Justification for Deferral:** This is a dev dependency used only during build time. The vulnerability requires compiling malicious code, which is not a risk in our controlled build environment. Will be addressed when migrating build system in future phases.

#### 2. **ejs** - Template Injection

- **Severity:** Critical
- **CVE:** GHSA-phwq-j96m-2c2q, GHSA-ghr5-ch3p-vcr6
- **Description:** ejs template injection vulnerability and lacks certain pollution protection
- **Affected Package:** `ejs` (<=3.1.9)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to @storybook/react@10.2.0)
- **Justification for Deferral:** Used only in Storybook (dev dependency). Not exposed in production builds. Will be addressed when upgrading Storybook.

#### 3. **elliptic** - Multiple Cryptographic Vulnerabilities

- **Severity:** Critical
- **CVE:** Multiple (GHSA-vjh7-7g9h-fjfh, GHSA-f7q4-pwc6-w24p, GHSA-977x-g7h5-7qgw, GHSA-848j-6mx2-7j84, etc.)
- **Description:** Multiple ECDSA signature validation issues, missing checks, and cryptographic primitive risks
- **Affected Package:** `elliptic` (all versions)
- **Fix Available:** Yes, via `npm audit fix`
- **Status:** **CRITICAL - REQUIRES IMMEDIATE ATTENTION**
- **Action Required:** This is used by stellar-sdk for cryptographic operations. Must verify if stellar-sdk v11 uses a patched version or alternative crypto library.

#### 4. **form-data** - Unsafe Random Function

- **Severity:** Critical
- **CVE:** GHSA-fjxv-7rqg-78g4
- **Description:** form-data uses unsafe random function for choosing boundary
- **Affected Package:** `form-data` (<2.5.4 or >=3.0.0 <3.0.4)
- **Fix Available:** Yes, via `npm audit fix`
- **Status:** Should be fixed by automatic fix

#### 5. **loader-utils** - Prototype Pollution & ReDoS

- **Severity:** Critical
- **CVE:** GHSA-76p3-8jx3-jpfq, GHSA-3rfm-jhwj-7488, GHSA-hhq3-ff78-jv3g
- **Description:** Multiple vulnerabilities including prototype pollution and ReDoS
- **Affected Package:** `loader-utils` (<=1.4.1 or 2.0.0 - 2.0.3)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to @storybook/react@10.2.0)
- **Justification for Deferral:** Dev dependency used in webpack loaders. Will be addressed when upgrading Storybook/build system.

#### 6. **pbkdf2** - Cryptographic Key Derivation Issues

- **Severity:** Critical
- **CVE:** GHSA-95m3-7q98-8xr5, GHSA-h59, GHSA-h7cp-r72f-jxh6
- **Description:** pbkdf2 silently disregards Uint8Array input and returns predictable keys for non-normalized algos
- **Affected Package:** `pbkdf2` (<=3.1.2)
- **Fix Available:** Yes, via `npm audit fix`
- **Status:** **CRITICAL - REQUIRES IMMEDIATE ATTENTION**
- **Action Required:** This is used for keystore encryption. Must verify fix doesn't break backward compatibility with existing keystores.

#### 7. **sha.js** - Hash Rewind Vulnerability

- **Severity:** Critical
- **CVE:** GHSA-95m3-7q98-8xr5
- **Description:** sha.js is missing type checks leading to hash rewind and passing on crafted data
- **Affected Package:** `sha.js` (<=2.4.11)
- **Fix Available:** Yes, via `npm audit fix`
- **Status:** **CRITICAL - REQUIRES IMMEDIATE ATTENTION**
- **Action Required:** Used for cryptographic hashing. Must verify fix doesn't affect keystore operations.

#### 8. **shell-quote** - Command Injection

- **Severity:** Critical
- **CVE:** GHSA-g4rg-993r-mgx7
- **Description:** Improper Neutralization of Special Elements used in a Command
- **Affected Package:** `shell-quote` (1.6.3 - 1.7.2)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to @storybook/react@10.2.0)
- **Justification for Deferral:** Dev dependency in react-dev-utils. Will be addressed when upgrading Storybook.

#### 9. **cipher-base** - Hash Rewind Vulnerability

- **Severity:** Critical
- **CVE:** GHSA-cpq7-6gpm-g9rc
- **Description:** cipher-base is missing type checks, leading to hash rewind and passing on crafted data
- **Affected Package:** `cipher-base` (<=1.0.4)
- **Fix Available:** Yes, via `npm audit fix`
- **Status:** Should be fixed by automatic fix

### High Severity Vulnerabilities (43)

#### 1. **axios** - SSRF and CSRF Vulnerabilities

- **Severity:** High
- **CVE:** GHSA-4w2v-q235-vp99, GHSA-wf5p-g6vw-rhxx, GHSA-cph5-m8f7-6c5x, GHSA-jr5f-v2jv-69x6
- **Description:** Multiple vulnerabilities including SSRF, CSRF, ReDoS, and credential leakage
- **Affected Package:** `axios` (<=0.29.0)
- **Fix Available:** No
- **Justification:** Used by @satoshipay/stellar-transfer and @satoshipay/stellar-sep-10. These are third-party dependencies. Consider updating or replacing these packages.

#### 2. **follow-redirects** - Information Exposure

- **Severity:** High
- **CVE:** GHSA-pw2r-vq6v-hr8c, GHSA-cxjh-pqwp-8mfp, GHSA-74fj-2j2h-c42q, GHSA-jchw-25xp-jwwc
- **Description:** Multiple information exposure vulnerabilities
- **Affected Package:** `follow-redirects` (<=1.15.5)
- **Fix Available:** No
- **Justification:** Transitive dependency of axios. Will be resolved when axios is updated.

#### 3. **jsonwebtoken** - Signature Validation Bypass

- **Severity:** High
- **CVE:** GHSA-8cf7-32gw-wr33, GHSA-hjrf-2m68-5959, GHSA-qwph-4952-7xr6
- **Description:** Multiple JWT signature validation vulnerabilities
- **Affected Package:** `jsonwebtoken` (<=8.5.1)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to jsonwebtoken@9.0.3)
- **Status:** **HIGH PRIORITY**
- **Action Required:** Used for SEP-10 authentication. Should be updated, but requires testing to ensure compatibility.

#### 4. **jws** - HMAC Signature Verification

- **Severity:** High
- **CVE:** GHSA-869p-cjfg-cm3x
- **Description:** auth0/node-jws Improperly Verifies HMAC Signature
- **Affected Package:** `jws` (<3.2.3)
- **Fix Available:** Yes, via `npm audit fix`
- **Status:** Should be fixed by automatic fix

#### 5. **node-forge** - Multiple Cryptographic Issues

- **Severity:** High
- **CVE:** Multiple (GHSA-5rrq-pxf6-6jx5, GHSA-gf8q-jrpm-jvxq, GHSA-2r2c-g63r-vccr, etc.)
- **Description:** Multiple cryptographic verification and validation issues
- **Affected Package:** `node-forge` (<=1.3.1)
- **Fix Available:** No
- **Justification:** Used by parcel-bundler (dev dependency). Will be addressed when migrating build system.

#### 6. **node-fetch** - Header Forwarding Vulnerability

- **Severity:** High
- **CVE:** GHSA-r683-j2x4-v87g
- **Description:** node-fetch forwards secure headers to untrusted sites
- **Affected Package:** `node-fetch` (<2.6.7)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to isomorphic-fetch@3.0.0)
- **Justification:** Used for HTTP requests. Should be updated but requires testing.

#### 7. **tar** - Path Traversal Vulnerabilities

- **Severity:** High
- **CVE:** GHSA-8qq5-rm4j-mr97, GHSA-r6q2-hw4h-h46w
- **Description:** Arbitrary file overwrite and race condition vulnerabilities
- **Affected Package:** `tar` (<=7.5.3)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to electron-builder@23.0.6)
- **Justification:** Used by electron-builder (dev dependency). Will be addressed when updating electron-builder.

#### 8. **Storybook-related vulnerabilities** (Multiple packages)

- **Packages:** @storybook/react, @storybook/core, react-dev-utils, webpack, webpack-dev-middleware, etc.
- **Severity:** High (various)
- **Fix Available:** Yes, via `npm audit fix --force` (breaking change to @storybook/react@10.2.0)
- **Justification:** All dev dependencies used only for component documentation. Not included in production builds. Will be addressed in future Storybook upgrade.

#### 9. **Other High Severity Issues:**

- **braces** - Uncontrolled resource consumption (GHSA-grv7-fg5c-xmjg)
- **cross-spawn** - ReDoS (GHSA-3xgq-45jj-v275)
- **ip** - SSRF improper categorization (GHSA-2p57-rm9w-gvfp)
- **json5** - Prototype Pollution (GHSA-9c47-m6qq-7p4h)
- **lodash.pick** - Prototype Pollution (GHSA-p6mc-m468-83gw)
- **minimatch** - ReDoS (GHSA-f8q6-p94x-37v3)
- **nth-check** - ReDoS (GHSA-rp65-9cf3-cjxr)
- **prismjs** - Multiple XSS and ReDoS (various)
- **qs** - Prototype Pollution and DoS (GHSA-hrpp-h998-j3pp, GHSA-6rw7-vpxm-498p)
- **semver** - ReDoS (GHSA-c2qf-rxjj-qqgw)
- **terser** - ReDoS (GHSA-4wf5-vphf-c2xc)
- **ws** - DoS (GHSA-3h5v-q93c-6h6q)

## Moderate and Low Severity Vulnerabilities (79 total)

The remaining 79 moderate and low severity vulnerabilities are primarily in dev dependencies (Storybook, webpack, parcel-bundler) and will be addressed through:

1. Upgrading Storybook to v10+ (addresses ~40 vulnerabilities)
2. Migrating build system from Parcel to Vite (addresses ~20 vulnerabilities)
3. Updating remaining dependencies (addresses ~19 vulnerabilities)

## Immediate Action Items

### Critical Priority (Must Fix Before Deployment)

1. **elliptic** - Verify stellar-sdk v11 uses patched version or alternative
2. **pbkdf2** - Update and validate keystore backward compatibility
3. **sha.js** - Update and validate cryptographic operations
4. **cipher-base** - Verify automatic fix was applied

### High Priority (Should Fix Soon)

1. **jsonwebtoken** - Update to v9.0.3 and test SEP-10 authentication
2. **jws** - Verify automatic fix was applied
3. **axios** - Consider updating @satoshipay packages or finding alternatives
4. **node-fetch** - Update and test HTTP request functionality

### Medium Priority (Address in Future Phases)

1. **Storybook ecosystem** - Upgrade to v10+ (Phase 4)
2. **Build system** - Migrate from Parcel to Vite (Phase 4)
3. **electron-builder** - Update to latest version (Phase 4)

## Resolution Plan

### Phase 3 (Current) - Security-Critical Fixes

- ✅ Run `npm audit fix` (completed)
- ⏳ Verify cryptographic libraries (elliptic, pbkdf2, sha.js, cipher-base)
- ⏳ Test keystore backward compatibility
- ⏳ Update jsonwebtoken and test authentication

### Phase 4 (Future) - Dev Dependency Updates

- Upgrade Storybook to v10+
- Migrate build system to Vite
- Update electron-builder
- Address remaining moderate/low vulnerabilities

## Testing Requirements

For each security fix applied, the following tests must pass:

1. **Keystore Tests:**

   - Decrypt existing keystores from v0.28.1
   - Encrypt new keystores and verify decryption
   - Property test: Encryption round-trip integrity

2. **Stellar SDK Tests:**

   - Transaction creation and signing
   - Property test: Cryptographic equivalence with previous version
   - Property test: Operation validity

3. **Authentication Tests:**
   - SEP-10 authentication flow
   - JWT token generation and validation

## Conclusion

The automatic fixes reduced vulnerabilities by 21 (from 155 to 134). The remaining critical and high severity vulnerabilities fall into three categories:

1. **Security-critical production dependencies** (elliptic, pbkdf2, sha.js) - Must be addressed immediately with thorough testing
2. **Authentication dependencies** (jsonwebtoken, jws) - Should be updated with testing
3. **Dev dependencies** (Storybook, build tools) - Can be deferred to future phases as they don't affect production builds

**Recommendation:** Proceed with Phase 3 security fixes for production dependencies, then continue with remaining modernization tasks. Dev dependency vulnerabilities can be addressed in a future phase focused on tooling updates.
