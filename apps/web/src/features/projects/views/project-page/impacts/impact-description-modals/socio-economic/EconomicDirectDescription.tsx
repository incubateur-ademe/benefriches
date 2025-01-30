import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";

type Props = {
  impactsData: SocioEconomicDetailedImpact["economicDirect"];
};

const EconomicDirectDescription = ({ impactsData }: Props) => {
  return (
    <ImpactSubSectionDescription
      title="Impacts socio-économiques directs"
      impactsData={impactsData}
      subSectionName="economic_direct"
    >
      <p>
        Les impacts économiques directs sont liés, le cas échéant, à la suppression d’une friche (ex
        : Dépenses de gestion et de sécurisation de la friche évitées), à la concrétisation du
        projet (ex : recettes d’exploitation si création d’une centrale photovoltaïque) ou à l’arrêt
        d’une activité (ex : arrêt d’une exploitation agricole en cas de comparaison d’un scénario
        de la réalisation d’un projet donné sur une friche vs. un autre scénario envisageant le même
        projet sur un espace agricole).
      </p>
    </ImpactSubSectionDescription>
  );
};

export default EconomicDirectDescription;
