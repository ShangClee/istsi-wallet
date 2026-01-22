# Keystore Encryption Parameters Validation

## Overview

This document validates that the encryption parameters used by the `key-store` library (v1.1.0) remain unchanged after the Solar Wallet modernization. This is critical for maintaining backward compatibility with existing encrypted keystores.

## Encryption Library

**Library**: `key-store` v1.1.0  
**Source**: https://github.com/andywer/key-store  
**Dependencies**:

- `fast-sha256` v1.1.0 (PBKDF2 implementation)
- `tweetnacl` v1.0.0 (xsalsa20-poly1305 cipher)
- `tweetnacl-util` v0.15.0 (encoding utilities)

## Encryption Parameters

### Key Derivation Function (KDF)

**Algorithm**: PBKDF2 (Password-Based Key Derivation Function 2)

**Parameters**:

- **Digest Algorithm**: SHA-256
- **Iterations**: Configurable (default: 10,000 in library, but Solar Wallet uses 10,000 for test accounts)
- **Salt**: Random nonce (24 bytes, base64 encoded)
- **Output Key Length**: 32 bytes (tweetnacl.secretbox.keyLength)

**Implementation Location**: `node_modules/key-store/lib/index.js`

```javascript
function deriveHashFromPassword(password, metadata) {
  return sha256.pbkdf2(
    tweetnacl_util_1.default.decodeUTF8(password),
    tweetnacl_util_1.default.decodeBase64(metadata.nonce),
    metadata.iterations,
    tweetnacl_1.default.secretbox.keyLength
  )
}
```

**Validation**: ✅ CONFIRMED

- PBKDF2 uses SHA-256 digest (via `fast-sha256` library)
- Iterations are stored in metadata and preserved per keystore entry
- Nonce is used as salt and stored with each encrypted key
- Output length is 32 bytes (NaCl secretbox key length)

### Cipher Algorithm

**Algorithm**: XSalsa20-Poly1305 (authenticated encryption)

**Parameters**:

- **Cipher**: XSalsa20 (stream cipher)
- **MAC**: Poly1305 (message authentication code)
- **Key Length**: 32 bytes (derived from PBKDF2)
- **Nonce Length**: 24 bytes (randomly generated per encryption)

**Implementation**: TweetNaCl's `secretbox` function

```javascript
function encrypt(privateData, metadata, password) {
  var secretKey = deriveHashFromPassword(password, metadata)
  var data = tweetnacl_util_1.default.decodeUTF8(JSON.stringify(privateData))
  var encrypted = tweetnacl_1.default.secretbox(data, tweetnacl_util_1.default.decodeBase64(metadata.nonce), secretKey)
  return tweetnacl_util_1.default.encodeBase64(encrypted)
}

function decrypt(encryptedBase64, metadata, password) {
  var secretKey = deriveHashFromPassword(password, metadata)
  var decrypted = tweetnacl_1.default.secretbox.open(
    tweetnacl_util_1.default.decodeBase64(encryptedBase64),
    tweetnacl_util_1.default.decodeBase64(metadata.nonce),
    secretKey
  )
  if (!decrypted) {
    throw new Error("Decryption failed.")
  }
  return JSON.parse(tweetnacl_util_1.default.encodeUTF8(decrypted))
}
```

**Validation**: ✅ CONFIRMED

- Cipher is XSalsa20-Poly1305 (via TweetNaCl's secretbox)
- Nonce is 24 bytes (NaCl secretbox nonce length)
- Same nonce is used for both encryption and decryption
- Authenticated encryption prevents tampering

## Keystore Data Structure

Each encrypted key entry has the following structure:

```typescript
interface KeyEntry<PublicData> {
  metadata: {
    nonce: string // Base64-encoded 24-byte nonce
    iterations: number // PBKDF2 iterations (typically 10,000)
  }
  public: PublicData // Unencrypted public metadata
  private: string // Base64-encoded encrypted private data
}
```

## Solar Wallet Usage

### Test Accounts (Web Platform)

Solar Wallet includes three test accounts in `src/Platform/ipc/web.ts`:

1. **Test account** (no password)

   - Iterations: 10,000
   - Public Key: GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W

2. **Test account with password**

   - Iterations: 10,000
   - Public Key: GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W

3. **Multisig Account**
   - Iterations: 10,000
   - Public Key: GDNVDG37WMKPEIXSJRBAQAVPO5WGOPKZRZZBPLWXULSX6NQNLNQP6CFF

### Production Usage

In production (Electron and Cordova), the keystore is created with:

- **Default iterations**: 10,000 (configurable via options)
- **Fresh nonce per key**: Generated using `tweetnacl.randomBytes(24)`
- **Persistent storage**: Electron uses electron-store, Cordova uses secure storage

## Backward Compatibility Guarantee

### What MUST NOT Change

1. **PBKDF2 Algorithm**: Must remain SHA-256 based
2. **Cipher Algorithm**: Must remain XSalsa20-Poly1305 (TweetNaCl secretbox)
3. **Key Length**: Must remain 32 bytes
4. **Nonce Length**: Must remain 24 bytes
5. **Metadata Structure**: Must preserve `nonce` and `iterations` fields
6. **Encoding**: Must remain Base64 for encrypted data and nonces

### What CAN Change

1. **Iteration Count**: Can be increased for new keys (stored in metadata)
2. **Public Data**: Can be extended with new fields
3. **Storage Backend**: Can change as long as data format is preserved

## Validation Results

| Parameter         | Expected Value    | Actual Value      | Status  |
| ----------------- | ----------------- | ----------------- | ------- |
| KDF Algorithm     | PBKDF2            | PBKDF2            | ✅ PASS |
| KDF Digest        | SHA-256           | SHA-256           | ✅ PASS |
| KDF Iterations    | 10,000 (default)  | 10,000            | ✅ PASS |
| KDF Output Length | 32 bytes          | 32 bytes          | ✅ PASS |
| Cipher            | XSalsa20-Poly1305 | XSalsa20-Poly1305 | ✅ PASS |
| Nonce Length      | 24 bytes          | 24 bytes          | ✅ PASS |
| Key Length        | 32 bytes          | 32 bytes          | ✅ PASS |
| Encoding          | Base64            | Base64            | ✅ PASS |

## Conclusion

✅ **ALL ENCRYPTION PARAMETERS VALIDATED**

The `key-store` library v1.1.0 uses the exact encryption parameters specified in the requirements:

- PBKDF2 with SHA-256 digest
- 10,000 iterations (default, configurable)
- XSalsa20-Poly1305 cipher (via TweetNaCl secretbox)
- 32-byte keys and 24-byte nonces

**No changes have been made to the encryption implementation during the modernization.**

The library dependencies (`fast-sha256`, `tweetnacl`, `tweetnacl-util`) remain at their original versions, ensuring cryptographic compatibility.

## Recommendations

1. **Do NOT upgrade** `key-store` library without thorough testing
2. **Do NOT upgrade** `fast-sha256`, `tweetnacl`, or `tweetnacl-util` without validation
3. **Always test** keystore backward compatibility when updating dependencies
4. **Maintain** test keystores from previous versions for regression testing

## References

- key-store library: https://github.com/andywer/key-store
- TweetNaCl.js: https://github.com/dchest/tweetnacl-js
- fast-sha256: https://github.com/dchest/fast-sha256-js
- PBKDF2 Specification: RFC 2898
- XSalsa20-Poly1305: https://nacl.cr.yp.to/secretbox.html

---

**Validated by**: Kiro AI  
**Date**: 2026-01-22  
**Solar Wallet Version**: v0.28.1  
**key-store Version**: v1.1.0
