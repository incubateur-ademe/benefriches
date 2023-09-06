import { ALLOWED_SURFACES_CATEGORIES } from "@/components/pages/SiteFoncier/Create/StateMachine";

const getSurfaceCategoryLabel = (
  value: (typeof ALLOWED_SURFACES_CATEGORIES)[number],
) => {
  switch (value) {
    case "impermeable_soils":
      return "Sols imperméabilisés (Parking bétonisé, voirie...)";
    case "buildings":
      return "Bâtiments (anciens sites de production, de stockages...)";
    case "permeable_artificial_soils":
      return "Sols artificialisés perméables (Parking, gravier...)";
    case "natural_areas":
      return "Espaces naturels (avec ou sans végétation : espaces verts, pleine terre)";
    case "body_of_water":
      return "Plan d’eau";
    case "other":
      return "Autre / NSP";
    default:
      return "Autre / NSP";
  }
};

export { getSurfaceCategoryLabel };
