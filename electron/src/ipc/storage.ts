import { app } from "electron"
import isDev from "electron-is-dev"
import Store from "electron-store"
import { createStore } from "key-store"
import { customAlphabet } from "nanoid"
import * as path from "path"
import { Keypair, Networks, Transaction } from "stellar-sdk"
import { expose } from "./_ipc"
import { Messages } from "../shared/ipc"

// Define the store schema for TypeScript
interface StoreSchema {
  keys?: Record<string, any>
  "installation-id"?: string
  settings?: Partial<Platform.SettingsData>
  ignoredSignatureRequests?: string[]
}

// Use legacy path to not break backwards-compatibility
const storeDirectoryPath = path.join(app.getPath("appData"), "satoshipay-stellar-wallet")

// Use different key stores for development and production
const mainStore = new Store<StoreSchema>({
  cwd: storeDirectoryPath,
  name: isDev ? "development" : "config"
}) as Store<StoreSchema> & {
  has(key: keyof StoreSchema): boolean
  get<K extends keyof StoreSchema>(key: K): StoreSchema[K]
  set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void
}

const readKeys = () => {
  return mainStore.has("keys") ? mainStore.get("keys") : {}
}

const updateKeys = (arg: any) => {
  mainStore.set("keys", arg)
}

const keystore = createStore<PrivateKeyData, PublicKeyData>(updateKeys, readKeys())

export function readInstallationID() {
  if (!mainStore.has("installation-id")) {
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 8)
    mainStore.set("installation-id", nanoid())
  }
  return mainStore.get("installation-id")!
}

/////////////
// Keystore:

expose(Messages.GetKeyIDs, function getKeyIDs() {
  return keystore.getKeyIDs()
})

expose(Messages.GetPublicKeyData, function getPublicKeyData(keyID) {
  return keystore.getPublicKeyData(keyID as string)
})

expose(Messages.GetPrivateKeyData, function getPrivateKeyData(keyID, password) {
  return keystore.getPrivateKeyData(keyID as string, password as string)
})

expose(Messages.SaveKey, function saveKey(keyID, password, privateData, publicData?) {
  return keystore.saveKey(
    keyID as string,
    password as string,
    privateData as PrivateKeyData,
    publicData as PublicKeyData | undefined
  )
})

expose(Messages.SavePublicKeyData, function saveKey(keyID, publicData) {
  return keystore.savePublicKeyData(keyID as string, publicData as PublicKeyData)
})

expose(Messages.RemoveKey, function removeKey(keyID) {
  return keystore.removeKey(keyID as string)
})

expose(Messages.SignTransaction, function signTransaction(internalAccountID, transactionXDR, password) {
  try {
    const account = keystore.getPublicKeyData(internalAccountID as string)
    const networkPassphrase = account.testnet ? Networks.TESTNET : Networks.PUBLIC
    const transaction = new Transaction(transactionXDR as string, networkPassphrase)

    const privateKey = keystore.getPrivateKeyData(internalAccountID as string, password as string).privateKey

    transaction.sign(Keypair.fromSecret(privateKey))

    return transaction
      .toEnvelope()
      .toXDR()
      .toString("base64")
  } catch (error) {
    throw Object.assign(new Error("Wrong password."), { name: "WrongPasswordError" })
  }
})

/////////////
// Settings:

expose(Messages.ReadSettings, function readSettings() {
  return mainStore.has("settings") ? mainStore.get("settings")! : {}
})

expose(Messages.StoreSettings, function storeSettings(updatedSettings: Partial<Platform.SettingsData>) {
  const prevSettings = mainStore.has("settings") ? mainStore.get("settings")! : {}
  mainStore.set("settings", { ...prevSettings, ...updatedSettings })
  return true
})

//////////////////
// Dismissed txs:

expose(Messages.ReadIgnoredSignatureRequestHashes, function readIgnoredSignatureRequestHashes() {
  return mainStore.has("ignoredSignatureRequests") ? mainStore.get("ignoredSignatureRequests")! : []
})

expose(Messages.StoreIgnoredSignatureRequestHashes, function storeIgnoredSignatureRequestHashes(
  updatedHashes: string[]
) {
  mainStore.set("ignoredSignatureRequests", updatedHashes)
  return true
})
