// oxlint-disable no-console
import { Feature, FeatureCollection, Point } from "geojson";
import type { Address } from "shared";

import { fail, success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";

import { AddressSearchGateway, SearchAddressOptions } from "./mapAdemeProjectToFriche";

const BAN_API_URL = "https://api-adresse.data.gouv.fr/search/?";

// https://adresse.data.gouv.fr/api-doc/adresse
type BanBaseAddress = {
  label: string;
  id: string;
  name: string;
  postcode: string;
  citycode: string;
  city: string;
};

type BanStreetAddress = BanBaseAddress & {
  type: "street";
  street: string;
};

type BanHouseNumberAddress = BanBaseAddress & {
  type: "housenumber";
  street: string;
  housenumber: string;
};

type BanMunicipalityAddress = BanBaseAddress & {
  type: "municipality";
  municipality: string;
  population: number;
};

type BanAddress = BanStreetAddress | BanHouseNumberAddress | BanMunicipalityAddress;

type ErrorResponse = { code: number; message: string };
type BanFeatureCollection = FeatureCollection<Point, BanAddress>;
type APIResponse = BanFeatureCollection | ErrorResponse;

const mapBanAddressToAddress = (banFeature: Feature<Point, BanAddress>): Address => {
  const props = banFeature.properties;

  const address: Address = {
    banId: props.id,
    value: props.label,
    city: props.city,
    cityCode: props.citycode,
    postCode: props.postcode,
    // oxlint-disable-next-line no-non-null-assertion
    long: banFeature.geometry.coordinates[0]!,
    // oxlint-disable-next-line no-non-null-assertion
    lat: banFeature.geometry.coordinates[1]!,
  };

  switch (props.type) {
    case "housenumber":
      return {
        ...address,
        streetName: props.street,
        streetNumber: props.housenumber,
      };
    case "street":
      return {
        ...address,
        streetName: props.street,
      };
    default:
      return address;
  }
};

/**
 * Implementation of AddressSearchGateway using real BAN API calls
 */
export class BanAddressSearchGateway implements AddressSearchGateway {
  async search(
    searchText: string,
    options?: SearchAddressOptions,
  ): Promise<TResult<Address[], "ServiceError" | "NoAddressFound">> {
    const queryParams = new URLSearchParams({ q: searchText });

    if (options?.type) {
      queryParams.append("type", options.type);
    }
    const url = `${BAN_API_URL}${queryParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `[BAN API] HTTP error ${response.status} ${response.statusText} for "${searchText}"`,
        );
        return fail("ServiceError");
      }

      const result = (await response.json()) as APIResponse;

      if ("code" in result) {
        console.error(`[BAN API] API error response for "${searchText}":`, result);
        return fail("ServiceError");
      }

      if (!result.features || result.features.length === 0) {
        console.warn(`[BAN API] No results found for "${searchText}"`);
        return fail("NoAddressFound");
      }

      const addresses = result.features.map(mapBanAddressToAddress);
      return success(addresses);
    } catch (err) {
      // oxlint-disable-next-line no-console
      console.error(`[BAN API] Fetch failed for "${searchText}":`, err);
      return fail("ServiceError");
    }
  }
}
