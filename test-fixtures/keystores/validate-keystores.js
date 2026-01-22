/**
 * Script to validate test keystores can be decrypted correctly
 *
 * This script verifies that:
 * 1. Keystores can be loaded and decrypted with correct passwords
 * 2. Decrypted private keys match the expected values
 * 3. Wrong passwords fail to decrypt
 */

const { createStore } = require("key-store")
const fs = require("fs")
const path = require("path")

// Load the manifest
const manifestPath = path.join(__dirname, "keystore-manifest.json")
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

console.log("Validating test keystores...")
console.log("")

let totalTests = 0
let passedTests = 0
let failedTests = 0

// Validate each keystore
for (const config of manifest) {
  console.log(`Validating ${config.filename}...`)

  // Load the keystore file
  const keystorePath = path.join(__dirname, config.filename)
  const keystoreData = JSON.parse(fs.readFileSync(keystorePath, "utf8"))

  // Create a keystore instance
  const keystore = createStore(() => {}, keystoreData)

  // Validate each key
  for (const keyConfig of config.keys) {
    totalTests++

    try {
      // Test 1: Decrypt with correct password
      const privateData = keystore.getPrivateKeyData(keyConfig.keyID, keyConfig.password)

      if (privateData.privateKey === keyConfig.privateKey) {
        console.log(`  ✓ ${keyConfig.keyID}: Decryption successful`)
        passedTests++
      } else {
        console.log(`  ✗ ${keyConfig.keyID}: Private key mismatch`)
        console.log(`    Expected: ${keyConfig.privateKey}`)
        console.log(`    Got: ${privateData.privateKey}`)
        failedTests++
      }

      // Test 2: Verify public data
      const publicData = keystore.getPublicKeyData(keyConfig.keyID)
      if (publicData.publicKey === keyConfig.publicKey) {
        console.log(`  ✓ ${keyConfig.keyID}: Public key matches`)
        passedTests++
      } else {
        console.log(`  ✗ ${keyConfig.keyID}: Public key mismatch`)
        failedTests++
      }
      totalTests++

      // Test 3: Wrong password should fail
      totalTests++
      try {
        keystore.getPrivateKeyData(keyConfig.keyID, keyConfig.password + "wrong")
        console.log(`  ✗ ${keyConfig.keyID}: Wrong password did not fail`)
        failedTests++
      } catch (error) {
        console.log(`  ✓ ${keyConfig.keyID}: Wrong password correctly rejected`)
        passedTests++
      }
    } catch (error) {
      console.log(`  ✗ ${keyConfig.keyID}: Decryption failed`)
      console.log(`    Error: ${error.message}`)
      failedTests++
    }
  }

  console.log("")
}

// Summary
console.log("=".repeat(60))
console.log("Validation Summary")
console.log("=".repeat(60))
console.log(`Total tests: ${totalTests}`)
console.log(`Passed: ${passedTests}`)
console.log(`Failed: ${failedTests}`)
console.log("")

if (failedTests === 0) {
  console.log("✓ All keystores validated successfully!")
  process.exit(0)
} else {
  console.log("✗ Some validations failed")
  process.exit(1)
}
