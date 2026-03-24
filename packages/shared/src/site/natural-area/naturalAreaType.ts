import z from "zod";

export const naturalAreaTypeSchema = z.enum([
  "PRAIRIE",
  "FOREST",
  "WET_LAND",
  "MIXED_NATURAL_AREA",
]);

export type NaturalAreaType = z.infer<typeof naturalAreaTypeSchema>;

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
