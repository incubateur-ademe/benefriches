import { useContext, useMemo } from "react";
import { AggregatedReconversionProjectOnSiteImpactItemView, sumListWithKey } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { filterByName } from "@/shared/core/filter-by-name/filterByName";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import ModalTable from "../../shared/ModalTable";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { humanityBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactsData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["humanity"]["avoidedHealthExpenses"];
};

const getChartColor = (
  impactName:
    | "avoidedTrafficCo2EqEmissions"
    | "avoidedCo2eqWithEnergyProduction"
    | "avoidedAirConditioningCo2eqEmissions",
) => {
  switch (impactName) {
    case "avoidedCo2eqWithEnergyProduction":
      return "#F6E900";
    case "avoidedAirConditioningCo2eqEmissions":
      return "#1F60FB";
    case "avoidedTrafficCo2EqEmissions":
      return "#C750CA";
  }
};

const AvoidedCo2MonetaryValueDescription = ({ impactsData = [] }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = useMemo(
    () =>
      filterByName(
        impactsData,
        "avoidedTrafficCo2EqEmissions",
        "avoidedCo2eqWithEnergyProduction",
        "avoidedAirConditioningCo2eqEmissions",
      ).map(({ total, name }) => ({
        label: getSocioEconomicImpactLabel(name),
        color: getChartColor(name),
        value: total,
        name,
      })),
    [impactsData],
  );

  const total = sumListWithKey(data, "value");

  return (
    <ModalBody size="large">
      <ModalHeader
        title="☁️ Valeur monétaire de la décarbonation"
        value={
          data.length > 0
            ? {
                state: total > 0 ? "success" : "error",
                text: formatMonetaryImpact(total),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          humanityBreadcrumbSection,
          { label: "Valeur monétaire de la décarbonation" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnPointChart
            format="monetary"
            data={data}
            exportTitle="☁️ Valeur monétaire de la décarbonation"
          />

          <ModalTable
            caption="Liste des impacts liés à la valeur monétaire de la décarbonation"
            data={data.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              actor: "Humanité",
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  impactName: "avoidedCo2eqEmissions",
                  subSectionName: "humanity",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <p>
            Suite à l’accord de Paris, la France s’est fixé pour objectif d’atteindre la neutralité
            carbone en 2050. Pour y parvenir, État, ménages, collectivités territoriales et
            entreprises doivent réduire leurs émissions de gaz à effet de serre. Les actions à mener
            en ce sens peuvent être guidées par une valeur donnée à l’action pour le climat : « la
            valeur tutélaire du carbone ».
          </p>
          <p>
            La valeur monétaire de la décarbonation traduit l’investissement qui peut être évité
            pour décarboner à un niveau équivalent à ce que le projet permet.
          </p>

          <p>
            Dans le cadre des projets de reconversion de friches ou plus largement d’aménagement en
            renouvellement urbain, les sources d’émissions évitées en CO2 peuvent être multiples,
            selon le type de projet et ses caractéristiques. On peut notamment citer :
          </p>

          <ul>
            <li>la désimperméabilisation puis renaturation des sols,</li>
            <li>la production d’énergies renouvelables,</li>
            <li>la réduction des déplacements en véhicules individuels (thermiques),</li>
            <li>la réhabilitation de bâtiments,</li>
            <li>la réduction du besoin en rafraîchissement ou climatisation.</li>
          </ul>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedCo2MonetaryValueDescription;
