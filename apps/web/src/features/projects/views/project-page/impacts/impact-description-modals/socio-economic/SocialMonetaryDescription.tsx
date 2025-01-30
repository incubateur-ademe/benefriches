import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";

type Props = {
  impactsData: SocioEconomicDetailedImpact["socialMonetary"];
};

const SocialMonetaryDescription = ({ impactsData }: Props) => {
  return (
    <ImpactSubSectionDescription
      title="Impacts sociaux monétarisés"
      impactsData={impactsData}
      subSectionName="social_monetary"
    >
      <p>
        Les impacts sociaux monétarisés sont des impacts qui touchent la population locale ou la
        société et pour lesquels une valeur monétaire (de type “consentement à payer”, “dépenses
        évitées”) existe. Par exemple : des dépenses de santé évitées (soit par la rationalisation
        des déplacements et risques (santé) ou impacts (pollution de l’air) associés) ou encore du
        temps de gagné (là encore par la rationalisation des déplacements, s’agissant de projet de
        renouvellement urbain).
      </p>
    </ImpactSubSectionDescription>
  );
};

export default SocialMonetaryDescription;
