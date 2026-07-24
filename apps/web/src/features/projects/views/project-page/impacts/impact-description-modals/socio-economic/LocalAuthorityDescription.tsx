import { useContext, useMemo } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  sumListWithKey,
  typedObjectEntries,
} from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
import { groupByListViewCategory } from "@/features/projects/core/projectImpactsSocioEconomic";
import { LOCAL_AUTHORITY_IMPACTS_CATEGORIES } from "@/features/projects/views/shared/impacts/impactGroupCategory";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";
import { getSocioEconomicImpactColor } from "./getSocioEconomicImpactColor";

type Props = {
  impactsData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["localAuthority"];
};

const LocalAuthorityDescription = ({ impactsData }: Props) => {
  const { total, ...impacts } = impactsData;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const details = useMemo(
    () =>
      typedObjectEntries(impacts).map(([category, items = []]) => ({
        label: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
        total: sumListWithKey(items, "total"),
        values: typedObjectEntries(groupByListViewCategory(items)).map(([name, details = []]) => ({
          name: name,
          value: sumListWithKey(details, "total"),
          label: getSocioEconomicImpactLabel(name),
          color: getSocioEconomicImpactColor(name),
          onClick: () => {
            updateModalContent({
              sectionName: "socio_economic",
              subSectionName: "localAuthority",
              impactName: name,
            });
          },
        })),
      })),
    [impacts, updateModalContent],
  );

  return (
    <ImpactSubSectionDescription
      title="Impacts socio-économiques pour la collectivité locale"
      impactsData={{
        total,
        details,
      }}
      subSectionName="localAuthority"
    >
      <p>
        Les impacts économiques pour la collectivité locale sont liés, le cas échéant, à la
        suppression d’une friche (ex : Dépenses de gestion et de sécurisation de la friche évitées),
        à la concrétisation du projet (ex : nouvelles recettes fiscales si création d’une centrale
        photovoltaïque) ou à des dépenses communales évités (ex : régulation de l'eau si dépollution
        ou renaturation).
      </p>
    </ImpactSubSectionDescription>
  );
};

export default LocalAuthorityDescription;
