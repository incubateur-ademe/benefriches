import { Feature, FeatureCollection, Point } from "geojson";

import {
  type AddressService,
  type AddressWithBanId,
} from "@/shared/views/components/form/Address/SearchAddressAutocompleteInput";

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

const mapNationalBaseAddressToAddress = (
  nationalBaseAddress: Feature<Point, BanAddress>,
): AddressWithBanId => {
  const address: AddressWithBanId = {
    banId: nationalBaseAddress.properties.id,
    value: nationalBaseAddress.properties.label,
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
  type?: "municipality" | "street" | "housenumber" | "locality";
};

export class NationalAddressBaseService implements AddressService {
  async search(searchText: string, options?: Options) {
    const queryParams = new URLSearchParams({ q: searchText });

    if (options?.type) {
      queryParams.append("type", options.type);
    }

    try {
      const response = await fetch(`${BAN_API_URL}${queryParams.toString()}`);

      const result = (await response.json()) as APIResponse;

      if ("code" in result) {
        throw new Error(result.message);
      }
      return result.features.map(mapNationalBaseAddressToAddress);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
