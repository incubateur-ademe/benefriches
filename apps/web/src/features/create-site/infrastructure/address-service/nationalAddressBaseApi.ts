import { Feature, FeatureCollection, Point } from "geojson";

import { AddressService } from "@/shared/views/components/form/Address/SearchAddressAutocompleteInput";

import { Address } from "../../core/siteFoncier.types";

const BAN_API_URL = "https://api-adresse.data.gouv.fr/search/?";

// https://adresse.data.gouv.fr/api-doc/adresse

type DefaultProperties = "label" | "id" | "name" | "postcode" | "citycode" | "city" | "context";

type StreetProperties = "street";

type HouseNumberProperties = "housenumber";

type GeoJsonProperties =
  | ({ type: "street" } & {
      [name in DefaultProperties | StreetProperties]: string;
    })
  | ({ type: "housenumber" } & {
      [name in DefaultProperties | StreetProperties | HouseNumberProperties]: string;
    })
  | ({ type: "municipality" } & ({
      [name in DefaultProperties]: string;
    } & { population: number; municipality: string }))
  | ({ type: "locality" } & { [name in DefaultProperties]: string });

type ErrorResponse = { code: number; message: string };
type BanFeatureCollection = FeatureCollection<Point, GeoJsonProperties>;
type APIResponse = BanFeatureCollection | ErrorResponse;

const mapNationalBaseAddressToAddress = (
  nationalBaseAddress: Feature<Point, GeoJsonProperties>,
): Address => {
  const address = {
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
    case "municipality":
      return {
        ...address,
        municipality: nationalBaseAddress.properties.municipality,
        population: nationalBaseAddress.properties.population,
      };
    default:
      return address;
  }
};

type Options = {
  type?: "municipality" | "street" | "housenumber" | "locality";
};

export class NationalAddressBaseService implements AddressService {
  async search(searchText: string, options?: Options): Promise<Address[]> {
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
