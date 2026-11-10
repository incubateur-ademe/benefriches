import type { Address } from "shared";

export type AddressWithBanId = Address & { banId: string };

export type AddressType = "municipality" | "street" | "housenumber" | "locality";

// The national address base (BAN) rejects longer queries.
export const ADDRESS_SEARCH_MAX_LENGTH = 200;

export interface AddressSearchGateway {
  /** Rejects when the search fails; resolves with an empty list when no address matches. */
  search(searchText: string, options: { type?: AddressType }): Promise<AddressWithBanId[]>;
}
