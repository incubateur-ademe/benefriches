export const getActorLabel = (label: string) => {
  switch (label) {
    case "community":
      return "Collectivité";
    case "french_society":
      return "Société française";
    case "human_society":
      return "Humanité";
    case "local_residents":
      return "Habitants";
    case "local_workers":
      return "Actifs";
    case "local_companies":
      return "Entreprises locales";
    case "local_people_or_companies":
      return "Habitants ou entreprises locales";
    default:
      return label;
  }
};
