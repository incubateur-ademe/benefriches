import { MutabilityUsage } from "shared";

export const getMutabilityUsageDisplayName = (usage: MutabilityUsage): string => {
  return {
    culture: "Lieu culturel ou touristique",
    renaturation: "Espace de nature",
    equipements: "Équipements publics",
    tertiaire: "Bureaux",
    residentiel: "Habitations et commerces de proximité",
    photovoltaique: "Centrale photovoltaïque",
    industrie: "Zone industrielle ou logistique",
  }[usage];
};
