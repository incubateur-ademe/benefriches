import { useContext } from "react";

import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";
import {
  ImpactModalDescriptionContext,
  UpdateModalContentArgs,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { ModalDataProps } from "../../ImpactModalDescription";
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
      color: "#F6DB1F",
      value: impactData?.minorInjuries ?? 0,
      name: "avoided_traffic_minor_injuries",
    },
    {
      label: "🚑 Blessés graves évités",
      color: "#E73518",
      value: impactData?.severeInjuries ?? 0,
      name: "avoided_traffic_severe_injuries",
    },
    {
      label: "🪦 Décès évités",
      color: "#2D163C",
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
          <ModalColumnPointChart
            format="default"
            data={data}
            exportTitle={`🚘 ${TITLE}`}
            exportSubtitle="Grâce aux déplacements évités"
          />
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
