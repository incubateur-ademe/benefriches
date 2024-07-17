import DataLine from "./DataLine";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import {
  getLabelForMixedUseNeighbourhoodDevelopmentExpense,
  MixedUseNeighbourhoodDevelopmentExpense,
} from "@/shared/domain/mixedUseNeighbourhood";
import {
  getLabelForPhotovoltaicInstallationCostPurpose,
  PhotovoltaicInstallationCost,
} from "@/shared/domain/reconversionProject";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumList } from "@/shared/services/sum/sum";

type Props = {
  developmentPlanType: ProjectDevelopmentPlanType;
  installationCosts: ProjectFeatures["developmentPlan"]["installationCosts"];
};

export default function DevelopmentPlanInstallationExpenses({
  developmentPlanType,
  installationCosts,
}: Props) {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (
        <>
          <DataLine
            label={<strong>Dépenses d'installation de la centrale photovoltaïque</strong>}
            value={
              <strong>{formatNumberFr(sumList(installationCosts.map((r) => r.amount)))} €</strong>
            }
          />
          {installationCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForPhotovoltaicInstallationCostPurpose(
                  purpose as PhotovoltaicInstallationCost["purpose"],
                )}
                value={`${formatNumberFr(amount)} €`}
                className="fr-pl-2w"
                key={purpose}
              />
            );
          })}
        </>
      );
    case "MIXED_USE_NEIGHBOURHOOD":
      return (
        <>
          <DataLine
            label={<strong>Dépenses d'aménagement du quartier</strong>}
            value={
              <strong>{formatNumberFr(sumList(installationCosts.map((r) => r.amount)))} €</strong>
            }
          />
          {installationCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForMixedUseNeighbourhoodDevelopmentExpense(
                  purpose as MixedUseNeighbourhoodDevelopmentExpense["purpose"],
                )}
                value={`${formatNumberFr(amount)} €`}
                className="fr-pl-2w"
                key={purpose}
              />
            );
          })}
        </>
      );
  }
}
