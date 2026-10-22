import { sumListWithKey, typedObjectEntries } from "shared";

import { serializeContentState } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import { getSocioEconomicImpactColor } from "../../../impact-description-modals/colors";
import ModalColumnSeriesChart from "../../../impact-description-modals/modal-charts/ModalColumnSeriesChart";
import ModalData from "../../../impact-description-modals/modal-layout/ModalData";
import ModalGroupTable from "../../../impact-description-modals/modal-table/ModalGroupTable";
import { getSocioEconomicImpactLabel } from "../../../shared/getImpactLabel";
import { LOCAL_AUTHORITY_IMPACTS_CATEGORIES } from "../../../shared/impacts/impactGroupCategory";
import type { DataProps } from "../developmentScoreModalsConfig";

export default function LocalAuthorityEconomicScoreData({
  modalsData,
  getUpdateDetailsLink,
}: DataProps) {
  const impacts = modalsData.economicImpactsByBearerAndCategory.localAuthority.impacts;

  const data = typedObjectEntries(
    Object.groupBy(impacts, (item) => {
      switch (item.keyName) {
        case "oldRentalIncomeLoss":
        case "projectedRentalIncome":
          return "rentalIncome";

        case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
        case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
          return "fricheCosts";

        case "previousSiteOperationBenefitLoss":
        case "projectOperatingExpenses":
        case "projectOperatingRevenues":
          return "operatingEconomicBalance";

        case "propertyTransferDutiesIncome":
        case "localTransferDutiesIncrease":
        case "taxesIncome":
          return "taxesIncome";

        case "waterRegulation":
        case "fricheRoadsAndUtilitiesExpenses":
          return "municipalityExpenses";
        default:
          return "other";
      }
    }),
  ).map(([category, items = []]) => ({
    label: category === "other" ? "Autres" : LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
    total: sumListWithKey(items, "total"),
    values: items.map(({ keyName, total }) => ({
      name: keyName,
      value: total,
      label: getSocioEconomicImpactLabel(keyName),
      color: getSocioEconomicImpactColor(keyName),
      linkProps: getUpdateDetailsLink(
        serializeContentState({
          sectionName: "socioEconomic.localAuthority" as const,
          impactDetailsName: keyName,
        }),
      ),
    })),
  }));
  return (
    <ModalData noPadding>
      <ModalColumnSeriesChart
        format="monetary"
        exportTitle="Impacts socio-économiques pour la collectivité"

        data={data}
      />

      <ModalGroupTable
        caption="Liste des impacts socio-économiques pour la collectivité"
        data={data}
      />
    </ModalData>
  );
}
