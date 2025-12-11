// oxlint-disable no-console
import fs from "node:fs";
import type { Address } from "shared";

import { success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";

import type { AddressSearchGateway, SearchAddressOptions } from "./mapAdemeProjectToFriche";

type CacheStore = Record<string, Address[]>;

/**
 * Wraps an AddressSearchGateway with a file-based cache.
 * Successful results are persisted to disk so subsequent script runs
 * don't need to call the address API for already-resolved cities.
 */
export class CachedAddressSearchGateway implements AddressSearchGateway {
  private cache: CacheStore = {};

  constructor(
    private readonly delegate: AddressSearchGateway,
    private readonly cacheFilePath: string,
  ) {
    this.loadCache();
  }

  private loadCache(): void {
    if (!fs.existsSync(this.cacheFilePath)) {
      return;
    }
    try {
      const raw = fs.readFileSync(this.cacheFilePath, "utf-8");
      this.cache = JSON.parse(raw) as CacheStore;
      console.log(
        `[AddressCache] Loaded ${Object.keys(this.cache).length} cached entries from ${this.cacheFilePath}`,
      );
    } catch (err) {
      console.warn(
        `[AddressCache] Could not read cache file, starting fresh: ${err instanceof Error ? err.message : String(err)}`,
      );
      this.cache = {};
    }
  }

  private saveCache(): void {
    try {
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2), "utf-8");
    } catch (err) {
      console.warn(
        `[AddressCache] Could not save cache file: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async search(
    searchText: string,
    options?: SearchAddressOptions,
  ): Promise<TResult<Address[], "ServiceError" | "NoAddressFound">> {
    const cacheKey = `${searchText}__${options?.type ?? ""}`;

    if (cacheKey in this.cache) {
      console.log(`[AddressCache] Hit for "${searchText}"`);
      // oxlint-disable-next-line no-non-null-assertion
      return success(this.cache[cacheKey]!);
    }

    console.log(`[AddressCache] Miss for "${searchText}", calling API...`);
    const result = await this.delegate.search(searchText, options);

    if (result.isSuccess()) {
      this.cache[cacheKey] = result.getData();
      this.saveCache();
    }

    return result;
  }
}
