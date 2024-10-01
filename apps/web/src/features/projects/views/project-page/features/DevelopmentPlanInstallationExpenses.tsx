import { MixedUseNeighbourhoodDevelopmentExpense, PhotovoltaicInstallationExpense } from "shared";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import { getLabelForMixedUseNeighbourhoodDevelopmentExpense } from "@/shared/domain/mixedUseNeighbourhood";
import { getLabelForPhotovoltaicInstallationExpensePurpose } from "@/shared/domain/reconversionProject";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumList } from "@/shared/services/sum/sum";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";

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
            noBorder
            label={<strong>Dépenses d'installation de la centrale photovoltaïque</strong>}
            value={
              <strong>{formatNumberFr(sumList(installationCosts.map((r) => r.amount)))} €</strong>
            }
          />
          {installationCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForPhotovoltaicInstallationExpensePurpose(
                  purpose as PhotovoltaicInstallationExpense["purpose"],
                )}
                value={`${formatNumberFr(amount)} €`}
                isDetails
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
            noBorder
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
                isDetails
                key={purpose}
              />
            );
          })}
        </>
      );
  }
}
