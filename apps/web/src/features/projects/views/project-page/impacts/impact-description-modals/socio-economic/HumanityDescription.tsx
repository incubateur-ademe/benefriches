import { useContext, useMemo } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  sumListWithKey,
  typedObjectEntries,
} from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
import { groupByListViewCategory } from "@/features/projects/core/projectImpactsSocioEconomic";
import { HUMANITY_IMPACTS_CATEGORIES } from "@/features/projects/views/shared/impacts/impactGroupCategory";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";
import { getSocioEconomicImpactColor } from "./getSocioEconomicImpactColor";

type Props = {
  impactsData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["humanity"];
};

const HumanityDescription = ({ impactsData }: Props) => {
  const { total, ...impacts } = impactsData;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const details = useMemo(
    () =>
      typedObjectEntries(impacts).map(([category, items = []]) => ({
        label: HUMANITY_IMPACTS_CATEGORIES[category].label,
        total: sumListWithKey(items, "total"),
        values: typedObjectEntries(groupByListViewCategory(items)).map(([name, details = []]) => ({
          name: name,
          value: sumListWithKey(details, "total"),
          label: getSocioEconomicImpactLabel(name),
          color: getSocioEconomicImpactColor(name),
          onClick: () => {
            updateModalContent({
              sectionName: "socio_economic",
              subSectionName: "humanity",
              impactName: name,
            });
          },
        })),
      })),
    [impacts, updateModalContent],
  );

  return (
    <ImpactSubSectionDescription
      title="Impacts pour la société française et l'humanité"
      impactsData={{
        total,
        details,
      }}
      subSectionName="humanity"
    >
      <p>
        Les impacts pour la société française et l'humanité sont des impacts, plutôt indirects, que
        la réalisation du projet aura sur les milieux (eau, air, écosystèmes) et pour lesquels une
        valeur monétaire (de type “consentement à payer”, “dépenses évitées”) existe. Par exemple
        des émissions de CO2 évitées (dûes aux changements d’affectation des sols ou encore en cas
        de réhabilitation de bâtiments), mais aussi des pertes de services écosystémiques rendus par
        les sols, en particulier en cas de comparaison d’un scénario de la réalisation d’un projet
        donné sur une friche vs. un autre scénario envisageant le même projet sur un espace
        agricole, naturel ou forestier.
      </p>
      <p>
        Afin de pouvoir comparer les valeurs de ces indicateurs au bilan de l’opération (qui est
        exprimé en €), il est nécessaire de convertir celles qui ne sont naturellement pas exprimées
        en € (ex : tonnes de de CO2 évitées, pertes de services écosystémiques) en valeurs
        monétaires. On parle alors de ”monétarisation”.
      </p>
    </ImpactSubSectionDescription>
  );
};

export default HumanityDescription;
