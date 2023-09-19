// https://adresse.data.gouv.fr/api-doc/adresse

import { FeatureCollection, Feature, Point } from "geojson";

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

type BanFeatureCollection = FeatureCollection<Point, GeoJsonProperties>;
export type BanFeature = Feature<Point, GeoJsonProperties>;

const banSearch = async (value: string) => {
  const queryParams = new URLSearchParams({ q: value });
  const response = await fetch(`${BAN_API_URL}${queryParams.toString()}`);

  try {
    const result = (await response.json()) as BanFeatureCollection;
    return result.features;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export default banSearch;
