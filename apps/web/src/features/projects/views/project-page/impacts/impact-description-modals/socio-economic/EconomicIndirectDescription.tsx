import { SocioEconomicImpact } from "shared";

import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";

type Props = {
  impactsData: SocioEconomicImpact[];
};

const EconomicIndirectDescription = ({ impactsData }: Props) => {
  return (
    <ImpactSubSectionDescription
      title="Impacts socio-économiques indirects"
      impactsData={impactsData}
      subSectionName="economic_indirect"
    >
      <p>
        Les impacts économiques indirects sont les retombées associées à la concrétisation du
        projet, pour la collectivité (ex : recettes fiscales), les riverains (ex : augmentation de
        la valeur patrimoniale de leur bien), ou même plus largement la société (ex : dépenses de
        réparation automobiles évitées du fait d’une rationalisation des déplacements et risques
        associés).
      </p>
    </ImpactSubSectionDescription>
  );
};

export default EconomicIndirectDescription;
