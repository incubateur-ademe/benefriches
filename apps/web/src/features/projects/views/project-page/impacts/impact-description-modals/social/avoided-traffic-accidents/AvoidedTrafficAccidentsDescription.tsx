import { useContext } from "react";
import { sumListWithKey } from "shared";

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
  impactData?: ModalDataProps["impactsData"]["aggregatedReconversionImpacts"]["impactsMetrics"];
};

const AvoidedTrafficAccidentsDescription = ({ impactData = [] }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = impactData?.reduce<
    {
      name: string;
      label: string;
      value: number;
      color?: string | undefined;
    }[]
  >((result, item) => {
    switch (item.name) {
      case "avoidedTrafficAccidentsSevereInjuries":
        return result.concat({
          label: "🚑 Blessés graves évités",
          color: "#E73518",
          value: item.total,
          name: "avoided_traffic_severe_injuries",
        });
      case "avoidedTrafficAccidentsMinorInjuries":
        return result.concat({
          label: "🤕 Blessés légers évités",
          color: "#F6DB1F",
          value: item.total,
          name: "avoided_traffic_minor_injuries",
        });
      case "avoidedTrafficAccidentsDeaths":
        return result.concat({
          label: "🪦 Décès évités",
          color: "#2D163C",
          value: item.total,
          name: "avoided_traffic_deaths",
        });
      default:
        return result;
    }
  }, []);

  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🚘 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatDefaultImpact(sumListWithKey(data, "value")),
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
