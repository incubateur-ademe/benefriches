export const getActorLabel = (label: string) => {
  switch (label) {
    case "community":
      return "Collectivité";
    case "french_society":
      return "Société française";
    case "human_society":
      return "Humanité";
    case "local_residents":
      return "Population locale";
    case "local_workers":
      return "Actifs locaux";
    case "local_companies":
      return "Structures locales";
    case "local_people_or_companies":
      return "Population ou structures locales";
    default:
      return label;
  }
};
