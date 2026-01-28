import { Federation, StellarToml } from "stellar-sdk"
import { AccountRecord } from "~Generic/lib/stellar-expert"
import { AssetRecord } from "~Generic/lib/stellar-ticker"
import { CustomError } from "~Generic/lib/errors"

export async function fetchWellknownAccounts(testnet: boolean): Promise<AccountRecord[]> {
  const requestURL = testnet
    ? "https://api.stellar.expert/api/explorer/testnet/directory"
    : "https://api.stellar.expert/api/explorer/public/directory"

  const response = await fetch(requestURL)

  if (response.status >= 400) {
    throw CustomError("BadResponseError", `Bad response (${response.status}) from stellar.expert server`, {
      status: response.status,
      server: "stellar.expert"
    })
  }

  const json = await response.json()
  const knownAccounts = json._embedded.records as AccountRecord[]
  return knownAccounts
}

function byAccountCountSorter(a: AssetRecord, b: AssetRecord) {
  return b.num_accounts - a.num_accounts
}

function trimAccountRecord(record: AssetRecord) {
  return {
    code: record.code,
    desc: record.desc,
    issuer: record.issuer,
    issuer_detail: {
      name: record.issuer_detail.name,
      url: record.issuer_detail.url
    },
    name: record.name,
    num_accounts: record.num_accounts,
    status: record.status,
    type: record.type
  }
}

export async function fetchAllAssets(tickerURL: string): Promise<AssetRecord[]> {
  // If we are using stellar.expert API
  if (tickerURL.includes("api.stellar.expert")) {
    const response = await fetch(tickerURL)

    if (response.status >= 400) {
      throw CustomError("BadResponseError", `Bad response (${response.status}) from stellar.expert server`, {
        status: response.status,
        server: "stellar.expert"
      })
    }

    const json = await response.json()
    // stellar.expert returns { _embedded: { records: [...] } } structure
    const allAssets = (json._embedded?.records || []).map((record: any) => ({
      code: record.asset.split("-")[0],
      desc: record.desc || "",
      issuer: record.asset.split("-")[1],
      issuer_detail: {
        name: record.domain || "",
        url: record.domain ? `https://${record.domain}` : ""
      },
      name: record.asset.split("-")[0],
      num_accounts: record.accounts || 0,
      status: "live",
      type: "credit_alphanum12" // simplified
    }))
    return allAssets.sort(byAccountCountSorter).map((record: any) => trimAccountRecord(record))
  }

  const requestURL = new URL("/assets.json", tickerURL)
  const response = await fetch(String(requestURL))

  if (response.status >= 400) {
    throw CustomError("BadResponseError", `Bad response (${response.status}) from stellar.expert server`, {
      status: response.status,
      server: "stellar.expert"
    })
  }

  const json = await response.json()
  const allAssets = json.assets as AssetRecord[]
  const abbreviatedAssets = allAssets.sort(byAccountCountSorter).map(record => trimAccountRecord(record))
  return abbreviatedAssets
}

export async function fetchStellarToml(
  domain: string,
  options: { allowHttp?: boolean; timeout?: number } = {}
): Promise<any> {
  try {
    return await StellarToml.Resolver.resolve(domain, options)
  } catch (error) {
    // tslint:disable-next-line no-console
    console.warn(`Could not resolve stellar.toml data for domain ${domain}:`, error)
    return undefined
  }
}

export function resolveStellarAddress(address: string, options?: { allowHttp?: boolean; timeout?: number }) {
  return Federation.Server.resolve(address, options)
}
