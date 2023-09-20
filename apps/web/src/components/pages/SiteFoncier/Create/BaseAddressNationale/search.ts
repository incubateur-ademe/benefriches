// https://adresse.data.gouv.fr/api-doc/adresse

import { Feature, FeatureCollection, Point } from "geojson";

const BAN_API_URL = "https://api-adresse.data.gouv.fr/search/?";

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
export type BanFeature = Feature<Point, GeoJsonProperties>;

const banSearch = async (value: string) => {
  const queryParams = new URLSearchParams({ q: value });

  try {
    const response = await fetch(`${BAN_API_URL}${queryParams.toString()}`);

    const result = (await response.json()) as APIResponse;

    if ("code" in result) {
      throw new Error(result.message);
    }
    return result.features;
  } catch (error) {
    console.error(error);
    return [] as BanFeature[];
  }
};
export default banSearch;
