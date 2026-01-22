import fs from "fs"
import path from "path"
import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { createStore } from "key-store"

// Define types locally if not available globally in test context
interface PublicKeyData {
  cosignerOf?: string
  name: string
  password: boolean
  publicKey: string
  testnet: boolean
}

interface PrivateKeyData {
  privateKey: string
}

const fixturesDir = path.join(__dirname, "../test-fixtures/keystores")
const manifestPath = path.join(fixturesDir, "keystore-manifest.json")

describe("Task 10.2: Keystore Backward Compatibility", () => {
  // Load manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))

  manifest.forEach((fixture: any) => {
    it(`should successfully decrypt keys from ${fixture.filename}`, () => {
      const keystorePath = path.join(fixturesDir, fixture.filename)
      const keystoreData = JSON.parse(fs.readFileSync(keystorePath, "utf-8"))

      // Initialize store with fixture data
      // We pass a dummy save handler as we are only reading
      const store = createStore<PrivateKeyData, PublicKeyData>(() => {}, keystoreData)

      fixture.keys.forEach((key: any) => {
        // Attempt to decrypt
        const decrypted = store.getPrivateKeyData(key.keyID, key.password)

        // Verify
        expect(decrypted.privateKey).toBe(key.privateKey)

        // Also verify public data retrieval
        const publicData = store.getPublicKeyData(key.keyID)
        expect(publicData.publicKey).toBe(key.publicKey)
      })
    })
  })
})

describe("Task 10.3: Encryption Round-Trip Integrity", () => {
  it("should maintain integrity through encryption and decryption cycles", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // password
        fc.string({ minLength: 10 }), // privateKey (simulated)
        fc.string({ minLength: 1 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s)), // keyID (simple chars to avoid key naming issues if any)
        (password, privateKey, keyID) => {
          let storage: any = {}
          const saveKeys = (data: any) => {
            storage = data
          }

          // Create new store
          const store = createStore<PrivateKeyData, PublicKeyData>(saveKeys, {})

          const privateData: PrivateKeyData = { privateKey }
          const publicData: PublicKeyData = {
            name: "test-account",
            password: true,
            publicKey: "mock-public-key",
            testnet: true
          }

          // Encrypt and save
          store.saveKey(keyID, password, privateData, publicData)

          // 1. Verify immediate decryption
          const decryptedImmediate = store.getPrivateKeyData(keyID, password)
          expect(decryptedImmediate.privateKey).toBe(privateKey)

          // 2. Verify persistence (reloading from storage)
          const storeReloaded = createStore<PrivateKeyData, PublicKeyData>(() => {}, storage)
          const decryptedReloaded = storeReloaded.getPrivateKeyData(keyID, password)
          expect(decryptedReloaded.privateKey).toBe(privateKey)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
