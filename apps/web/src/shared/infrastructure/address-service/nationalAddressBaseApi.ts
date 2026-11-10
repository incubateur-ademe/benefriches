import type { Feature, FeatureCollection, Point } from "geojson";

import type {
  AddressSearchGateway,
  AddressType,
  AddressWithBanId,
} from "@/shared/core/gateways/AddressSearchGateway";

const BAN_API_URL = "https://data.geopf.fr/geocodage/search/?";

// https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage#71270
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

// A municipality label is only the town name: several towns share a name (e.g. Saint-Denis 93200
// and 97400), so the postcode is added to tell them apart in the suggestions and wherever the
// saved address is shown. Street and house number labels already hold the postcode.
const getAddressLabel = ({ type, label, postcode }: BanAddress): string =>
  type === "municipality" ? `${label} (${postcode})` : label;

const mapNationalBaseAddressToAddress = (
  nationalBaseAddress: Feature<Point, BanAddress>,
): AddressWithBanId => {
  const address: AddressWithBanId = {
    banId: nationalBaseAddress.properties.id,
    value: getAddressLabel(nationalBaseAddress.properties),
    city: nationalBaseAddress.properties.city,
    cityCode: nationalBaseAddress.properties.citycode,
    postCode: nationalBaseAddress.properties.postcode,
    long: nationalBaseAddress.geometry.coordinates[0]!,
    lat: nationalBaseAddress.geometry.coordinates[1]!,
  };
  switch (nationalBaseAddress.properties.type) {
    case "housenumber":
      return {
        ...address,
        streetName: nationalBaseAddress.properties.street,
        streetNumber: nationalBaseAddress.properties.housenumber,
      };
    case "street":
      return {
        ...address,
        streetName: nationalBaseAddress.properties.street,
      };
    default:
      return address;
  }
};

type Options = {
  type?: AddressType;
};

export class NationalAddressBaseService implements AddressSearchGateway {
  async search(searchText: string, options: Options) {
    const queryParams = new URLSearchParams({ q: searchText });

    if (options?.type) {
      queryParams.append("type", options.type);
    }

    // Rejects on any failure so the caller can tell "no address found" from "search failed".
    const response = await fetch(`${BAN_API_URL}${queryParams.toString()}`);

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => undefined)) as ErrorResponse | undefined;
      throw new Error(
        errorBody?.message ?? `Address search failed with HTTP status ${response.status}`,
      );
    }

    const result = (await response.json()) as APIResponse;

    if ("code" in result) {
      throw new Error(result.message);
    }
    return result.features.map(mapNationalBaseAddressToAddress);
  }
}
