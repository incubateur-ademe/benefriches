import { useContext } from "react";

import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactItemDetails from "../../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../list-view/ImpactItemGroup";
import { ModalDataProps } from "../../ImpactModalDescription";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBarColoredChart from "../../shared/ModalBarColoredChart";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Personnes préservées des accidents de la route";

type Props = {
  impactData?: ModalDataProps["impactsData"]["social"]["avoidedTrafficAccidents"];
};

const AvoidedTrafficAccidentsDescription = ({ impactData }: Props) => {
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
                text: formatDefaultImpact(impactData.total),
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: TITLE }]}
      />
      <ModalGrid>
        <ModalData>
          <ModalBarColoredChart
            formatFn={formatDefaultImpact}
            data={[
              {
                label: "🤕 Blessés légers évités",
                color: "#13ECD6",
                value: impactData?.minorInjuries ?? 0,
              },
              {
                label: "🚑 Blessés graves évités",
                color: "#13BAEC",
                value: impactData?.severeInjuries ?? 0,
              },
              { label: "🪦 Décès évités", color: "#1371EC", value: impactData?.deaths ?? 0 },
            ]}
          />

          <ImpactItemGroup isClickable>
            <ImpactItemDetails
              value={impactData?.minorInjuries ?? 0}
              label="🤕 Blessés légers évités"
              type="default"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();
                  updateModalContent({
                    sectionName: "social",
                    impactName: "avoided_traffic_accidents",
                    impactDetailsName: "avoided_traffic_minor_injuries",
                  });
                },
              }}
            />
            <ImpactItemDetails
              value={impactData?.severeInjuries ?? 0}
              label="🚑 Blessés graves évités"
              type="default"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();

                  updateModalContent({
                    sectionName: "social",
                    impactName: "avoided_traffic_accidents",
                    impactDetailsName: "avoided_traffic_severe_injuries",
                  });
                },
              }}
            />
            <ImpactItemDetails
              value={impactData?.deaths ?? 0}
              label="🪦 Décès évités"
              type="default"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();

                  updateModalContent({
                    sectionName: "social",
                    impactName: "avoided_traffic_accidents",
                    impactDetailsName: "avoided_traffic_deaths",
                  });
                },
              }}
            />
          </ImpactItemGroup>
        </ModalData>

        <ModalContent>
          <AvoidedTrafficAccidentsContent />
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsDescription;
