export type NaturalAreaType = "PRAIRIE" | "FOREST" | "WET_LAND" | "MIXED_NATURAL_AREA";

export function getLabelForNaturalAreaType(naturalAreaType: NaturalAreaType): string {
  switch (naturalAreaType) {
    case "PRAIRIE":
      return "Prairie";
    case "FOREST":
      return "Forêt";
    case "WET_LAND":
      return "Zone humide";
    case "MIXED_NATURAL_AREA":
      return "Espace naturel mixte";
  }
}
