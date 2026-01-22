/**
 * Script to generate test keystores for backward compatibility testing
 *
 * This script creates keystores using the key-store library v1.1.0
 * to ensure we can validate backward compatibility after modernization.
 */

const { createStore } = require("key-store")
const { Keypair } = require("stellar-sdk")
const fs = require("fs")
const path = require("path")

// Generate real Stellar keypairs for testing
function generateTestKeypair() {
  const keypair = Keypair.random()
  return {
    privateKey: keypair.secret(),
    publicKey: keypair.publicKey()
  }
}

// Test keystore configurations
const keystoreConfigs = [
  {
    filename: "simple-password.json",
    description: "Single key with simple password",
    iterations: 10000,
    keys: [
      {
        keyID: "test-key-1",
        password: "test1234",
        ...generateTestKeypair(),
        name: "Test Account - Simple Password",
        testnet: true
      }
    ]
  },
  {
    filename: "complex-password.json",
    description: "Single key with complex password",
    iterations: 10000,
    keys: [
      {
        keyID: "test-key-2",
        password: "MyC0mpl3x!P@ssw0rd#2024",
        ...generateTestKeypair(),
        name: "Test Account - Complex Password",
        testnet: false
      }
    ]
  },
  {
    filename: "no-password.json",
    description: "Single key with empty password",
    iterations: 10000,
    keys: [
      {
        keyID: "test-key-3",
        password: "",
        ...generateTestKeypair(),
        name: "Test Account - No Password",
        testnet: true
      }
    ]
  },
  {
    filename: "multiple-keys.json",
    description: "Multiple keys with different passwords",
    iterations: 10000,
    keys: [
      {
        keyID: "test-key-4a",
        password: "password1",
        ...generateTestKeypair(),
        name: "Test Account 1",
        testnet: true
      },
      {
        keyID: "test-key-4b",
        password: "password2",
        ...generateTestKeypair(),
        name: "Test Account 2",
        testnet: true
      },
      {
        keyID: "test-key-4c",
        password: "password3",
        ...generateTestKeypair(),
        name: "Test Account 3",
        testnet: false
      }
    ]
  },
  {
    filename: "high-iterations.json",
    description: "Key with higher iteration count",
    iterations: 100000,
    keys: [
      {
        keyID: "test-key-5",
        password: "secure-password",
        ...generateTestKeypair(),
        name: "Test Account - High Iterations",
        testnet: false,
        iterations: 100000
      }
    ]
  }
]

// Generate keystores
async function generateKeystores() {
  const outputDir = __dirname
  const manifestPath = path.join(outputDir, "keystore-manifest.json")
  const manifest = []

  console.log("Generating test keystores...")
  console.log("Output directory:", outputDir)
  console.log("")

  for (const config of keystoreConfigs) {
    console.log(`Generating ${config.filename}...`)
    console.log(`  Description: ${config.description}`)
    console.log(`  Keys: ${config.keys.length}`)
    console.log(`  Iterations: ${config.iterations}`)

    let keystoreData = {}

    // Add each key to the keystore
    for (const keyConfig of config.keys) {
      const iterations = keyConfig.iterations || config.iterations

      // Create a temporary keystore with specific iterations
      const tempKeystore = createStore(
        data => {
          keystoreData = { ...keystoreData, ...data }
        },
        keystoreData,
        { iterations }
      )

      await tempKeystore.saveKey(
        keyConfig.keyID,
        keyConfig.password,
        { privateKey: keyConfig.privateKey },
        {
          name: keyConfig.name,
          publicKey: keyConfig.publicKey,
          testnet: keyConfig.testnet,
          password: keyConfig.password !== ""
        }
      )

      console.log(`    ✓ Added key: ${keyConfig.keyID}`)
    }

    // Save the keystore to file
    const outputPath = path.join(outputDir, config.filename)
    fs.writeFileSync(outputPath, JSON.stringify(keystoreData, null, 2))
    console.log(`  ✓ Saved to ${config.filename}`)
    console.log("")

    // Add to manifest
    manifest.push({
      filename: config.filename,
      description: config.description,
      iterations: config.iterations,
      keys: config.keys.map(k => ({
        keyID: k.keyID,
        password: k.password,
        privateKey: k.privateKey,
        publicKey: k.publicKey,
        name: k.name,
        testnet: k.testnet,
        iterations: k.iterations || config.iterations
      }))
    })
  }

  // Save manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log("✓ Generated keystore manifest")
  console.log("")
  console.log("All keystores generated successfully!")
  console.log(`Total keystores: ${keystoreConfigs.length}`)
  console.log(`Total keys: ${keystoreConfigs.reduce((sum, c) => sum + c.keys.length, 0)}`)
}

// Run the generator
generateKeystores().catch(error => {
  console.error("Error generating keystores:", error)
  process.exit(1)
})
