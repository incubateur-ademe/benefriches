import { SocioEconomicImpact } from "shared";

import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";

type Props = {
  impactsData: SocioEconomicImpact[];
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
      <p>
        Afin de pouvoir comparer les valeurs de ces indicateurs au bilan de l’opération (qui est
        exprimé en €), il est nécessaire de convertir celles qui ne sont naturellement pas exprimées
        en € (ex : pollution de l’air, temps de gagné) en valeurs monétaires. On parle alors de
        ”monétarisation”.
      </p>
    </ImpactSubSectionDescription>
  );
};

export default SocialMonetaryDescription;
