import { formatMonetaryImpact } from "shared";

import { findTotalByName } from "@/features/projects/core/group-impacts/findTotalByName";

import { serializeContentState } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import { getSocioEconomicImpactColor } from "../../../impact-description-modals/colors";
import ModalColumnPointChart from "../../../impact-description-modals/modal-charts/ModalColumnPointChart";
import ModalData from "../../../impact-description-modals/modal-layout/ModalData";
import ModalTable from "../../../impact-description-modals/modal-table/ModalTable";
import { getSocioEconomicImpactLabel } from "../../../shared/getImpactLabel";
import type { DataProps } from "../developmentScoreModalsConfig";

const ECOSYSTEM_SERVICES = [
  "newStoredCo2Eq",
  "natureRelatedWelnessAndLeisure",
  "forestRelatedProduct",
  "pollination",
  "invasiveSpeciesRegulation",
  "waterCycle",
  "nitrogenCycle",
  "soilErosion",
] as const;

export default function EcosystemServicesData({
  developmentScore,
  getUpdateDetailsLink,
}: DataProps) {
  const { metrics } = developmentScore.details.environmentScore.indicators.ecosystemServices;

  const details = ECOSYSTEM_SERVICES.map((name) => ({
    label: getSocioEconomicImpactLabel(`ecosystemServices.${name}`),
    value: findTotalByName(metrics.ecosystemicServices, name),
    color: getSocioEconomicImpactColor(`ecosystemServices.${name}`),
    linkProps: getUpdateDetailsLink(
      serializeContentState({
        sectionName: "socioEconomic.humanity",
        impactDetailsName: `ecosystemServices.${name}`,
      }),
    ),
  })).toSorted((a, b) => b.value - a.value);

  return (
    <ModalData noPadding>
      <ModalColumnPointChart
        format="monetary"
        data={details}
        exportTitle={getSocioEconomicImpactLabel("ecosystemServices")}
      />
      <ModalTable
        formatFn={formatMonetaryImpact}
        caption="Liste des impacts écosystémiques pouvant être rendus par les sols et leur valeur pour le projet"
        data={details}
      />
    </ModalData>
  );
}
