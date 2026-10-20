import { formatCO2Impact } from "shared";

import type { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";

import { serializeContentState } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import { getEnvironmentalImpactColor } from "../../../impact-description-modals/colors";
import { getImpactModalData } from "../../../impact-description-modals/getImpactData";
import ModalAreaChart from "../../../impact-description-modals/modal-charts/ModalAreaChart";
import ModalData from "../../../impact-description-modals/modal-layout/ModalData";
import ModalTable from "../../../impact-description-modals/modal-table/ModalTable";
import { getEnvironmentalImpactLabel } from "../../../shared/getImpactLabel";
import type { DataProps } from "../developmentScoreModalsConfig";

export default function Co2eqEmissionsVariationData({
  modalsData,
  getUpdateDetailsLink,
}: DataProps) {
  const data = getImpactModalData<EnvironmentalImpactMetricKeyName>(
    modalsData.environmentalMetricsByCategory.co2eq,
    "avoidedCo2eqEmissions",
    {
      getLabel: getEnvironmentalImpactLabel,
      getColor: getEnvironmentalImpactColor,
      getLinkProps: (key) =>
        getUpdateDetailsLink(
          serializeContentState({
            sectionName: "environmental.co2eq",
            impactDetailsName: key,
          }),
        ),
    },
  );
  if (!data?.breakdown || !data.details) {
    return null;
  }
  return (
    <ModalData noPadding>
      <ModalAreaChart
        type="co2"
        base={data.breakdown?.base}
        forecast={data.breakdown.forecast}
        difference={data.total}
        title={getEnvironmentalImpactLabel("avoidedCo2eqEmissions")}
        color={data.color}
        details={data?.details.map((item) => ({
          ...item,
          base: item.breakdown?.base ?? 0,
          forecast: item.breakdown?.forecast ?? item.value,
          difference: item.value,
        }))}
      />

      <ModalTable
        formatFn={formatCO2Impact}
        caption="Liste des émissions de Co2eq évitées"
        data={data?.details}
      />
    </ModalData>
  );
}
