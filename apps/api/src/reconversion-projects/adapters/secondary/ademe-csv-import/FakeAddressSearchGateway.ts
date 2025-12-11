import type { Address } from "shared";

import { fail, success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";

import type { AddressSearchGateway, SearchAddressOptions } from "./mapAdemeProjectToFriche";

export class FakeAddressSearchGateway implements AddressSearchGateway {
  private addressesResults: Address[][] = [];
  private shouldFail: boolean = false;

  search(
    _searchText: string,
    _options?: SearchAddressOptions,
  ): Promise<TResult<Address[], "ServiceError" | "NoAddressFound">> {
    if (this.shouldFail) {
      return Promise.resolve(fail("ServiceError"));
    }

    if (this.addressesResults.length === 0) {
      return Promise.resolve(fail("NoAddressFound"));
    }

    // oxlint-disable-next-line no-non-null-assertion
    const addressesResult = this.addressesResults[0]!;
    return Promise.resolve(success(addressesResult));
  }

  withAddressesResults(addresses: Address[][]): this {
    this.addressesResults = addresses;
    return this;
  }
}
