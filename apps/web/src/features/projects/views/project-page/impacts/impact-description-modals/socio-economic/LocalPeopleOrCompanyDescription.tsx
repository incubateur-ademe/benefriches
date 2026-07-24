import { useContext, useMemo } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  sumListWithKey,
  typedObjectEntries,
} from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
import { groupByListViewCategory } from "@/features/projects/core/projectImpactsSocioEconomic";
import { LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES } from "@/features/projects/views/shared/impacts/impactGroupCategory";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactSubSectionDescription from "./SocioEconomicSubSectionDescription";
import { getSocioEconomicImpactColor } from "./getSocioEconomicImpactColor";

type Props = {
  impactsData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["localPeopleOrCompany"];
};

const LocalPeopleOrCompanyDescription = ({ impactsData }: Props) => {
  const { total, ...impacts } = impactsData;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const details = useMemo(
    () =>
      typedObjectEntries(impacts).map(([category, items = []]) => ({
        label: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].label,
        total: sumListWithKey(items, "total"),

        values: typedObjectEntries(groupByListViewCategory(items)).map(([name, details = []]) => ({
          name: name,
          value: sumListWithKey(details, "total"),
          label: getSocioEconomicImpactLabel(name),
          color: getSocioEconomicImpactColor(name),
          onClick: () => {
            updateModalContent({
              sectionName: "socio_economic",
              subSectionName: "localPeopleOrCompany",
              impactName: name,
            });
          },
        })),
      })),
    [impacts, updateModalContent],
  );

  return (
    <ImpactSubSectionDescription
      title="Impacts pour les riverains"
      impactsData={{
        total,
        details: details,
      }}
      subSectionName="localPeopleOrCompany"
    >
      <p>
        Les impacts pour les riverains sont des impacts qui touchent la population locale ou les
        entreprises locales et pour lesquels une valeur monétaire (de type “consentement à payer”,
        “dépenses évitées”) existe. Par exemple : des dépenses de santé évitées (soit par la
        rationalisation des déplacements et risques (santé) ou impacts (pollution de l’air)
        associés) ou encore du temps de gagné (là encore par la rationalisation des déplacements,
        s’agissant de projet de renouvellement urbain).
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

export default LocalPeopleOrCompanyDescription;
