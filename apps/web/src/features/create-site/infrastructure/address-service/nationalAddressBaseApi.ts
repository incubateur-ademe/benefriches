import { Feature, FeatureCollection, Point } from "geojson";
import { Address } from "../../domain/siteFoncier.types";

import { AddressService } from "@/features/create-site/views/address/SearchAddressAutocompleteInput";

const BAN_API_URL = "https://api-adresse.data.gouv.fr/search/?";

// https://adresse.data.gouv.fr/api-doc/adresse

type GeoJsonProperties = {
  [name in
    | "label"
    | "id"
    | "housenumber"
    | "name"
    | "postcode"
    | "citycode"
    | "city"
    | "context"
    | "street"]: string;
};

type ErrorResponse = { code: number; message: string };
type BanFeatureCollection = FeatureCollection<Point, GeoJsonProperties>;
type APIResponse = BanFeatureCollection | ErrorResponse;

const mapNationalBaseAddressToAddress = (
  nationalBaseAddress: Feature<Point, GeoJsonProperties>,
): Address => {
  return {
    id: nationalBaseAddress.properties.id,
    value: nationalBaseAddress.properties.label,
    city: nationalBaseAddress.properties.city,
    cityCode: nationalBaseAddress.properties.citycode,
    postCode: nationalBaseAddress.properties.postcode,
    long: nationalBaseAddress.geometry.coordinates[0]!,
    lat: nationalBaseAddress.geometry.coordinates[1]!,
  };
};

export class NationalAddressBaseService implements AddressService {
  constructor() {}

  async search(searchText: string): Promise<Address[]> {
    const queryParams = new URLSearchParams({ q: searchText });

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
