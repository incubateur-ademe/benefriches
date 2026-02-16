import type { Address } from "shared";

export type AddressWithBanId = Address & { banId: string };

export type AddressType = "municipality" | "street" | "housenumber" | "locality";

export interface AddressSearchGateway {
  search(searchText: string, options: { type?: AddressType }): Promise<AddressWithBanId[]>;
}
