import { useContext } from "react";
import { AvoidedTrafficAccidentsImpact } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { getSocialImpactLabel } from "../../../getImpactLabel";
import ImpactItemDetails from "../../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBarColoredChart from "../../shared/ModalBarColoredChart";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Dépenses de santé évitées grâce à la diminution des accidents de la route";

type Props = {
  impactData?: AvoidedTrafficAccidentsImpact;
};

const getChartColor = (impactName: AvoidedTrafficAccidentsImpact["details"][number]["impact"]) => {
  switch (impactName) {
    case "avoided_traffic_deaths":
      return "#1371EC";
    case "avoided_traffic_minor_injuries":
      return "#13ECD6";
    case "avoided_traffic_severe_injuries":
      return "#13BAEC";
  }
};

const AvoidedTrafficAccidentsMonetaryValueDescription = ({ impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);
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
          <ModalBarColoredChart
            data={
              impactData?.details.map(({ amount, impact }) => ({
                label: getSocialImpactLabel(impact),
                color: getChartColor(impact),
                value: amount,
              })) ?? []
            }
          />
          <ImpactItemGroup isClickable>
            {impactData?.details.map(({ impact, amount }) => (
              <ImpactItemDetails
                key={impact}
                value={amount}
                label={getSocialImpactLabel(impact)}
                type="monetary"
                labelProps={{
                  onClick: (e) => {
                    e.stopPropagation();

                    updateModalContent({
                      sectionName: "socio_economic",
                      impactName: "avoided_traffic_accidents",
                      impactDetailsName: impact,
                    });
                  },
                }}
              />
            ))}
          </ImpactItemGroup>
        </ModalData>

        <ModalContent>
          <AvoidedTrafficAccidentsContent withMonetarisation />
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsMonetaryValueDescription;
