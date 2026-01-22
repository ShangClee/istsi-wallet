import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { Keypair, Operation, Asset, xdr } from "stellar-sdk"

describe("Property 8.4: Stellar SDK Operation Validity", () => {
  it("should create valid Payment operations that can be serialized/deserialized", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 12 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)), // Asset Code
        fc.double({ min: 0.0000001, max: 1000000, noNaN: true, noDefaultInfinity: true }), // Amount
        (assetCode, amountVal) => {
          const destKP = Keypair.random()
          const issuerKP = Keypair.random()
          const asset = new Asset(assetCode, issuerKP.publicKey())
          const amount = amountVal.toFixed(7) // Stellar allows up to 7 decimal places

          const op = Operation.payment({
            destination: destKP.publicKey(),
            asset: asset,
            amount: amount
          })

          const xdrOp = op.toXDR("hex")
          // @ts-ignore
          const parsed = xdr.Operation.fromXDR(xdrOp, "hex")

          expect(parsed).toBeDefined()
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe("Property 8.5: Stellar SDK Cryptographic Equivalence", () => {
  it("should maintain keypair integrity and signature verification", () => {
    fc.assert(
      fc.property(
        fc.string(), // Random data to sign
        dataString => {
          const kp = Keypair.random()
          const secret = kp.secret()
          const publicK = kp.publicKey()

          // Recreate from secret
          const kp2 = Keypair.fromSecret(secret)
          expect(kp2.publicKey()).toBe(publicK)
          expect(kp2.secret()).toBe(secret)

          // Recreate from public key
          const kp3 = Keypair.fromPublicKey(publicK)
          expect(kp3.publicKey()).toBe(publicK)

          // Sign and Verify
          const data = Buffer.from(dataString)
          const sig = kp.sign(data)

          expect(kp.verify(data, sig)).toBe(true)
          expect(kp2.verify(data, sig)).toBe(true)
          expect(kp3.verify(data, sig)).toBe(true)

          // Verify invalid signature fails
          if (sig.length > 0) {
            const badSig = Buffer.from(sig)
            badSig[0] = badSig[0] === 255 ? 0 : badSig[0] + 1
            expect(kp.verify(data, badSig)).toBe(false)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
