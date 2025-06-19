import { useContext } from "react";
import { AvoidedTrafficAccidentsImpact } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { getSocialImpactLabel } from "../../../getImpactLabel";
import ModalTable from "../../shared/ModalTable";
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Dépenses de santé évitées grâce à la diminution des accidents de la route";

type Props = {
  impactData?: AvoidedTrafficAccidentsImpact;
};

const getChartColor = (impactName: AvoidedTrafficAccidentsImpact["details"][number]["impact"]) => {
  switch (impactName) {
    case "avoided_traffic_deaths":
      return "#F6DB1F";
    case "avoided_traffic_minor_injuries":
      return "#E73518";
    case "avoided_traffic_severe_injuries":
      return "#2D163C";
  }
};

const AvoidedTrafficAccidentsMonetaryValueDescription = ({ impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data =
    impactData?.details.map(({ amount, impact }) => ({
      label: getSocialImpactLabel(impact),
      color: getChartColor(impact),
      value: amount,
      name: impact,
    })) ?? [];

  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🚘 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData.amount),
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          socialMonetaryBreadcrumbSection,
          { label: TITLE },
        ]}
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
            data={data.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              actor: "Société française",
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  impactName: "avoided_traffic_accidents",
                  impactDetailsName: name,
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
