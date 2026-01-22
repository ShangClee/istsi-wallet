import { describe, it } from "vitest"
import fc from "fast-check"

/**
 * Example property-based tests demonstrating the testing infrastructure
 *
 * Property-based tests validate universal properties across many generated inputs.
 * Each test should run minimum 100 iterations as per requirements.
 */

describe("Example Property Tests", () => {
  it("Property 1: Addition is commutative", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a
      }),
      { numRuns: 100 }
    )
  })

  it("Property 2: String concatenation length", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (str1, str2) => {
        const concatenated = str1 + str2
        return concatenated.length === str1.length + str2.length
      }),
      { numRuns: 100 }
    )
  })

  it("Property 3: Array reverse is involutive", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), arr => {
        const reversed = arr.slice().reverse()
        const doubleReversed = reversed.slice().reverse()
        return JSON.stringify(arr) === JSON.stringify(doubleReversed)
      }),
      { numRuns: 100 }
    )
  })
})
