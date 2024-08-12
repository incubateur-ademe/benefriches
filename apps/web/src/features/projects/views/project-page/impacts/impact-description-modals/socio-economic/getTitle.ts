import { SocioEconomicImpactDescriptionModalId } from "./types";

export const getSocioEconomicSectionModalTitle = (
  modalId: SocioEconomicImpactDescriptionModalId,
) => {
  switch (modalId) {
    case "socio-economic":
      return "🌍 Impacts socio-économiques";
    case "socio-economic.avoided-friche-costs":
      return "🏚 Dépenses de gestion et de sécurisation de la friche évitées";
    case "socio-economic.avoided-illegal-dumping-costs":
      return "🚮 Débarras de dépôt sauvage";
    case "socio-economic.avoided-other-securing-costs":
      return "🛡 Autres dépenses de sécurisation";
    case "socio-economic.avoided-security-costs":
      return "👮‍♀️ Gardiennage";
    case "socio-economic.avoided-co2-renewable-energy":
      return "⚡️️ Emissions de CO2-eq évitées grâce à la production d'énergies renouvelables";
    case "socio-economic.water-regulation":
      return "🚰 Régulation de la qualité de l'eau";
    case "socio-economic.ecosystem-services":
      return "🌻 Services écosystémiques";
    case "socio-economic.carbon-storage":
      return "🍂️ Carbone stocké dans les sols";
    case "socio-economic.nature-related-wellness-and-leisure":
      return "🚵‍♂️ Loisirs et bien-être liés à la nature";
  }
};
