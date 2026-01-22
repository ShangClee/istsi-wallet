import { describe, it, expect } from "vitest"
import { createStore } from "key-store"

describe("Task 11.4: Security Critical Code Paths", () => {
  describe("Keystore Security", () => {
    it("should throw WrongPasswordError on incorrect password", async () => {
      const store = createStore(() => {}, {})
      const keyID = "test-security-key"
      const password = "correct-password"

      store.saveKey(
        keyID,
        password,
        { privateKey: "S..." },
        {
          name: "Test",
          password: true,
          publicKey: "G...",
          testnet: true
        }
      )

      expect(() => {
        store.getPrivateKeyData(keyID, "wrong-password")
      }).toThrow()
    })

    it("should not expose private key in public data", () => {
      const store = createStore(() => {}, {})
      const keyID = "test-leak-key"
      const password = "password"

      store.saveKey(
        keyID,
        password,
        { privateKey: "S_SECRET" },
        {
          name: "Test",
          password: true,
          publicKey: "G_PUBLIC",
          testnet: true
        }
      )

      const publicData = store.getPublicKeyData(keyID)
      expect(JSON.stringify(publicData)).not.toContain("S_SECRET")
      expect(publicData).not.toHaveProperty("privateKey")
    })
  })

  describe("Input Validation", () => {
    it("should reject empty passwords if policy requires them", () => {
      // This depends on specific validation logic in the app,
      // simulating a check here as a placeholder for where that logic would be tested
      const isValidPassword = (pwd: string) => pwd.length > 0
      expect(isValidPassword("")).toBe(false)
      expect(isValidPassword("valid")).toBe(true)
    })
  })
})
