import { useContext } from "react";

import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

import { ModalDataProps } from "../../ImpactModalDescription";
import {
  ImpactModalDescriptionContext,
  UpdateModalContentArgs,
} from "../../ImpactModalDescriptionContext";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import ModalTable from "../../shared/ModalTable";
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Personnes préservées des accidents de la route";

type Props = {
  impactData?: ModalDataProps["impactsData"]["social"]["avoidedTrafficAccidents"];
};

const AvoidedTrafficAccidentsDescription = ({ impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = [
    {
      label: "🤕 Blessés légers évités",
      color: "#13ECD6",
      value: impactData?.minorInjuries ?? 0,
      name: "avoided_traffic_minor_injuries",
    },
    {
      label: "🚑 Blessés graves évités",
      color: "#13BAEC",
      value: impactData?.severeInjuries ?? 0,
      name: "avoided_traffic_severe_injuries",
    },
    {
      label: "🪦 Décès évités",
      color: "#1371EC",
      value: impactData?.deaths ?? 0,
      name: "avoided_traffic_deaths",
    },
  ];
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
          <ModalColumnPointChart format="default" data={data} />
          <ModalTable
            formatFn={formatDefaultImpact}
            caption="Détails des blessés et décès évités"
            data={data.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              onClick: () => {
                updateModalContent({
                  sectionName: "social",
                  impactName: "avoided_traffic_accidents",
                  impactDetailsName: name,
                } as UpdateModalContentArgs);
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <AvoidedTrafficAccidentsContent />
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsDescription;
