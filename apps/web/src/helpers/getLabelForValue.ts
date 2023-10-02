import { FricheSpaceType } from "@/components/pages/SiteFoncier/friche";

export const getSurfaceTypeLabel = (value: FricheSpaceType) => {
  switch (value) {
    case "impermeable_soils":
      return "Sols imperméabilisés (parking bitumé, voirie...)";
    case "buildings":
      return "Bâtiments (anciens sites de production, de stockage...)";
    case "permeable_artificial_soils":
      return "Sols artificialisés perméables (parc, pelouse, gravier...)";
    case "natural_areas":
      return "Espaces naturels (prairie, forêt, zone humid...)";
    case "AGRICULTURAL_LAND":
      return "Espaces agricoles (cultures, vignes, vergers...)";
    default:
      return "Autre";
  }
};
