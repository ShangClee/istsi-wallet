# Keystore Test Fixtures

This directory contains test keystores created with Solar Wallet v0.28.1 to validate backward compatibility after modernization.

## Purpose

These keystores are used to ensure that:

1. Keystores created with previous versions can be decrypted with the modernized version
2. Encryption parameters (PBKDF2, XSalsa20-Poly1305) remain unchanged
3. No data loss occurs during the upgrade

## Test Keystores

### 1. simple-password.json

- **Description**: Single key with simple password
- **Password**: `test1234`
- **Private Key**: `SCUGBCVYU6DNIX4677TFE37XWRASP7L2H2OGZ4RNU2ZS7XD4ZU5KZK5P`
- **Public Key**: `GB467YZKO7XHC2NGQBVYXJU5G2IU4424NCRBEGNKOZGTWTA2JXKQPHG5`
- **Iterations**: 10,000
- **Testnet**: true

### 2. complex-password.json

- **Description**: Single key with complex password
- **Password**: `MyC0mpl3x!P@ssw0rd#2024`
- **Private Key**: `SBNIESLH563EYNLZGHD3LQYPDBPEKLORMHRUR6EY3II4EDJWF4X66XLS`
- **Public Key**: `GA3GVVHM2BDDCYDJN6PT4JZKIPSOSMS66T3JT4KHBDUSFVBL6YCXKCXP`
- **Iterations**: 10,000
- **Testnet**: false

### 3. no-password.json

- **Description**: Single key with empty password
- **Password**: `` (empty string)
- **Private Key**: `SD46IAT4DRBJGIX74BR2KGB7NLRXNDPWZ7BLIBN2MTERO6U4PUUFGVS2`
- **Public Key**: `GDGGOF34TT5NS5PTBGTALDWLUYPZ4YTGEDQELQFSLA34LNEWJRMCXGOQ`
- **Iterations**: 10,000
- **Testnet**: true

### 4. multiple-keys.json

- **Description**: Multiple keys with different passwords
- **Keys**:
  - Key 1: Password `password1`, Private Key `SBB2RXNQ4QJ5B7BADOXGLZITAXYN2GHFSAHP4GZIJYK4NUSBFTWM5XGT`, Public Key `GDHX7FB4V6SVUKA52CPSQIRVKDJ553VXFY7W6GPX75VB47JSWIC7IRGY`
  - Key 2: Password `password2`, Private Key `SCBH33ZMH44RRH573O7Z3YY7VWUEFVHNIPESXTPM2WHU3MFKUCWP2E5V`, Public Key `GDJGS5K4UHFF5FVGSMWNT6JQQY5DKDPHHMKAE7QLWEG2PQANPWQAFF5N`
  - Key 3: Password `password3`, Private Key `SAM5J62XBO46OQXYGZ5SQ7IDHVLMYJFBYZ7HVZ4PIHUTVGOLQP4BVWOS`, Public Key `GCLMXZHZYAH6SPAFHR2QUM2TMUGAI4DPDDCFFZXUDOXCVH5LETMOONID`
- **Iterations**: 10,000

### 5. high-iterations.json

- **Description**: Key with higher iteration count
- **Password**: `secure-password`
- **Private Key**: `SDRVVPADO5PP6KJGEJ7MB4LBELSTSOJVJ66UDEKN3WYD56YWFMZEXVP4`
- **Public Key**: `GDOI7GO5DAJY7VZULIHCWHKQBKYTWW7GX5GZYI6LM2BXN2BHOGTQK4TW`
- **Iterations**: 100,000
- **Testnet**: false

## Usage

These keystores are used in property-based tests to validate:

- Decryption with correct password succeeds
- Decryption with wrong password fails
- Decrypted private keys match expected values
- All encryption parameters are preserved

## Important Notes

⚠️ **DO NOT DELETE OR MODIFY THESE FILES**

These keystores are critical for validating backward compatibility. Any changes could invalidate the tests.

⚠️ **THESE ARE TEST KEYS ONLY**

The private keys in these fixtures are for testing purposes only and should never be used for real funds.

## Generation

These keystores were generated using the `key-store` library v1.1.0 with the following code:

```typescript
import { createStore } from "key-store"
import { Keypair } from "stellar-sdk"

// Generate a keystore with specific parameters
const keystore = createStore(
  data => {
    /* save function */
  },
  {},
  { iterations: 10000 }
)

// Save a key
await keystore.saveKey(
  "key-id",
  "password",
  { privateKey: "S..." },
  { name: "Test Key", publicKey: "G...", testnet: true }
)
```

## Validation

To validate a keystore:

```typescript
import { createStore } from "key-store"

const keystore = createStore(() => {}, keystoreData)
const privateData = keystore.getPrivateKeyData("key-id", "password")
console.assert(privateData.privateKey === expectedPrivateKey)
```

### Running Validation

To validate all test keystores:

```bash
node test-fixtures/keystores/validate-keystores.js
```

This will:

1. Load each keystore file
2. Decrypt with the correct password and verify the private key matches
3. Verify the public key data is correct
4. Test that wrong passwords are rejected

**All 21 tests pass successfully** ✓
