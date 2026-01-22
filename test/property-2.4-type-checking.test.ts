import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { Asset, Keypair } from "stellar-sdk"
import { stringifyAsset, parseAssetID } from "../src/Generic/lib/stellar"

// Generate a pool of valid issuers to pick from to ensure validity
const validIssuers = Array.from({ length: 10 }, () => Keypair.random().publicKey())

describe("Property 2.4: TypeScript Type Checking (Asset Round-Trip)", () => {
  it("should maintain Asset integrity through stringification and parsing", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant("native"),
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 12 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
            fc.constantFrom(...validIssuers)
          )
        ),
        assetData => {
          let asset: Asset
          if (assetData === "native") {
            asset = Asset.native()
          } else {
            const [code, issuer] = assetData as [string, string]
            asset = new Asset(code, issuer)
          }

          const stringified = stringifyAsset(asset)
          const parsed = parseAssetID(stringified)

          expect(parsed.isNative()).toBe(asset.isNative())
          if (!asset.isNative()) {
            expect(parsed.getCode()).toBe(asset.getCode())
            expect(parsed.getIssuer()).toBe(asset.getIssuer())
          }
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
