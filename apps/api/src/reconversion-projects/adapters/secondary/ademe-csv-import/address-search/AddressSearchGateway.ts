import type { Address } from "shared";

import type { TResult } from "src/shared-kernel/result";

export type SearchAddressOptions = {
  type?: "municipality" | "street" | "housenumber" | "locality";
};

export interface AddressSearchGateway {
  search(
    searchText: string,
    options?: SearchAddressOptions,
  ): Promise<TResult<Address[], "ServiceError" | "NoAddressFound">>;
}
