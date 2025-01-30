import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";

type Props = {
  impactsData: SocioEconomicDetailedImpact["environmentalMonetary"];
};

const EnvironmentalMonetaryDescription = ({ impactsData }: Props) => {
  return (
    <ImpactSubSectionDescription
      title="Impacts environnementaux monétarisés"
      impactsData={impactsData}
      subSectionName="environmental_monetary"
    >
      <p>
        Les impacts environnementaux monétarisés sont des impacts, plutôt indirects, que la
        réalisation du projet aura sur les milieux (eau, air, écosystèmes) et pour lesquels une
        valeur monétaire (de type “consentement à payer”, “dépenses évitées”) existe. Par exemple
        des émissions de CO2 évitées (dûes aux changements d’affectation des sols ou encore en cas
        de réhabilitation de bâtiments), mais aussi des pertes de services écosystémiques rendus par
        les sols, en particulier en cas de comparaison d’un scénario de la réalisation d’un projet
        donné sur une friche vs. un autre scénario envisageant le même projet sur un espace
        agricole, naturel ou forestier.
      </p>
    </ImpactSubSectionDescription>
  );
};

export default EnvironmentalMonetaryDescription;
