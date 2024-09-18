import {
  SocioEconomicImpactByActor,
  SocioEconomicImpactByCategory,
} from "../../application/projectImpactsSocioEconomic.selectors";

export const getActorLabel = (
  label:
    | SocioEconomicImpactByActor[number]["name"]
    | SocioEconomicImpactByCategory["impacts"][number]["actors"][number]["name"],
) => {
  switch (label) {
    case "community":
      return "Collectivité";
    case "french_society":
      return "La société française";
    case "human_society":
      return "Société humaine";
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
