import { FricheSpaceType } from "@/components/pages/SiteFoncier/friche";

export const getLabelForFricheSpaceType = (value: FricheSpaceType) => {
  switch (value) {
    case "buildings":
      return "Bâtiments (anciens sites de production, de stockage...)";
    case "impermeable_soils":
      return "Sols imperméabilisés (parking bitumé, voirie...)";
    case "permeable_artificial_soils":
      return "Sols artificialisés perméables (parc, pelouse, gravier...)";
    case "natural_areas":
      return "Espace naturel ou agricole (cultures, prairies, forêt...)";
    default:
      return "Autre";
  }
};
