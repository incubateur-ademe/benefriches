import { useContext, useMemo } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  sumListWithKey,
  typedObjectEntries,
} from "shared";

import { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { groupIndirectEconomicImpactsByBearerAndCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
import { groupSocioEconomicImpactsByListViewCategory } from "@/features/projects/core/projectImpactsSocioEconomic";
import { LOCAL_AUTHORITY_IMPACTS_CATEGORIES } from "@/features/projects/views/shared/impacts/impactGroupCategory";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import { getSocioEconomicImpactColor } from "../../colors";
import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";

type Props = {
  impactsData: ModalDataProps["impactsData"];
};

const LocalAuthorityDescription = ({ impactsData }: Props) => {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  const { total, ...impacts } =
    groupIndirectEconomicImpactsByBearerAndCategory<AggregatedReconversionProjectOnSiteImpactItemView>(
      {
        indirectEconomicImpacts:
          impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
        indirectEconomicImpactsTotal:
          impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
        stakeholders: impactsData.stakeholders,
      },
    ).localAuthority;

  const details = useMemo(
    () =>
      typedObjectEntries(impacts).map(([category, items = []]) => ({
        label: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
        total: sumListWithKey(items, "total"),
        values: groupSocioEconomicImpactsByListViewCategory(items).map(({ keyName, total }) => ({
          name: keyName,
          value: total,
          label: getSocioEconomicImpactLabel(keyName),
          color: getSocioEconomicImpactColor(keyName),
          linkProps: getDetailsLink({
            sectionName: "socioEconomic.localAuthority",
            impactDetailsName: keyName,
          }),
        })),
      })),
    [impacts, getDetailsLink],
  );

  return (
    <ImpactSubSectionDescription
      title="Impacts socio-économiques pour la collectivité locale"
      impactsData={{
        total,
        details,
      }}
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
