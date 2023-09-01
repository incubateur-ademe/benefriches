const getSurfaceCategoryLabel = (
  value:
    | "production"
    | "storage"
    | "quarry"
    | "buildings"
    | "concrete_car_park"
    | "gravel_car_park"
    | "other_sealed_surface"
    | "non_vegetated_permeable_surface"
    | "vegetated_surface"
    | "open_ground"
    | "other"
    | "body_of_water",
) => {
  switch (value) {
    case "production":
      return "Anciens ateliers / sites de production";
    case "storage":
      return "Anciens bâtiments de stockage";
    case "quarry":
      return "Anciens bâtiments de stockage";
    case "buildings":
      return "Autres bâtiments";
    case "concrete_car_park":
      return "Parking ou VRD bétonnisé";
    case "gravel_car_park":
      return "Parking ou VRD gravier";
    case "other_sealed_surface":
      return "Autre surface imperméabilisée";
    case "non_vegetated_permeable_surface":
      return "Autre suface non végétalisée perméable";
    case "vegetated_surface":
      return "Surface végétalisée";
    case "open_ground":
      return "Pleine terre";
    case "other":
      return "Autre / NSP";
    default:
      return "Autre / NSP";
  }
};

export { getSurfaceCategoryLabel };
