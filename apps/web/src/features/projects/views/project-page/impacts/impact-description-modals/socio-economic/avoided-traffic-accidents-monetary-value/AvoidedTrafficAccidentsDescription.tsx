import { useContext, useMemo } from "react";
import { AggregatedReconversionProjectOnSiteImpactItemView, sumListWithKey } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
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
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { humanityBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Dépenses de santé évitées grâce à la diminution des accidents de la route";

type Props = {
  impactsData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["humanity"]["avoidedHealthExpenses"];
};

const getChartColor = (
  impactName:
    | "avoidedAccidentsMinorInjuriesExpenses"
    | "avoidedAccidentsSevereInjuriesExpenses"
    | "avoidedAccidentsDeathsExpenses",
) => {
  switch (impactName) {
    case "avoidedAccidentsDeathsExpenses":
      return "#F6DB1F";
    case "avoidedAccidentsMinorInjuriesExpenses":
      return "#E73518";
    case "avoidedAccidentsSevereInjuriesExpenses":
      return "#2D163C";
    default:
      return undefined;
  }
};

const AvoidedTrafficAccidentsMonetaryValueDescription = ({ impactsData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = useMemo(
    () =>
      filterByName(
        impactsData,
        "avoidedAccidentsMinorInjuriesExpenses",
        "avoidedAccidentsSevereInjuriesExpenses",
        "avoidedAccidentsDeathsExpenses",
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
        title={`🚘 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactsData
            ? {
                state: "success",
                text: formatMonetaryImpact(total),
              }
            : undefined
        }
        breadcrumbSegments={[mainBreadcrumbSection, humanityBreadcrumbSection, { label: TITLE }]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnPointChart
            format="monetary"
            data={data}
            exportTitle={`🚘 ${TITLE}`}
            exportSubtitle="Grâce aux déplacements évités"
          />
          <ModalTable
            caption="Liste des dépenses de santé évitées grâce aux accidents évités"
            data={data.map((item) => ({
              ...item,
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  impactName: "avoidedTrafficAccidents",
                  impactDetailsName: item.name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <AvoidedTrafficAccidentsContent withMonetarisation />
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsMonetaryValueDescription;
