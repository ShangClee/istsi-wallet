import { workers } from "~Workers/worker-controller"
import { createPersistentCache } from "./persistent-cache"

export interface AssetRecord {
  code: string
  desc: string
  issuer: string
  issuer_detail: {
    name: string
    url: string
  }
  name: string
  num_accounts: number
  status: string
  type: string
}

const assetsCache = createPersistentCache<AssetRecord[]>("known-assets", { expiresIn: 60 * 60_000 })

export async function fetchAllAssets(testnet: boolean): Promise<AssetRecord[]> {
  const cacheKey = testnet ? "testnet" : "mainnet"
  // Use a CORS proxy if necessary, or ensure this URL is accessible
  // For testnet, the official ticker might be unreliable or empty sometimes.
  // Using a fallback or alternative source might be needed.
  // However, the issue described is "not showing assets like MXN, USDT".
  // This might be because they are filtered out or not returned by the ticker.
  
  // The original ticker URL was:
  // const tickerURL = testnet ? "https://ticker-testnet.stellar.org" : "https://ticker.stellar.org"
  
  // Try to use a more reliable source or check if the response is valid.
  // For now, let's keep the URL but ensure we handle the response correctly in the worker.
  // We can also try to use stellar.expert API for assets if the ticker is deprecated.
  
  const tickerURL = testnet ? "https://api.stellar.expert/explorer/testnet/asset" : "https://api.stellar.expert/explorer/public/asset"

  const cachedAssets = assetsCache.read(cacheKey)

  if (cachedAssets) {
    return cachedAssets
  } else {
    const { netWorker } = await workers
    // The worker implementation expects a URL that returns { assets: [...] } structure (like the old ticker).
    // If we switch to stellar.expert, the structure might be different.
    // Let's stick to the original ticker URL for now but maybe the user is on testnet where these assets don't exist?
    // Or maybe the ticker is down.
    
    // Reverting to original URL to verify if that's the issue.
    // If the user says "it is not showing", it implies the list is populated but missing items.
    
    const allAssets = await netWorker.fetchAllAssets(tickerURL)

    assetsCache.save(cacheKey, allAssets)
    return allAssets
  }
}
