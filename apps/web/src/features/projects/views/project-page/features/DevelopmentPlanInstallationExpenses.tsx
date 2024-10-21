import { UrbanProjectDevelopmentExpense, PhotovoltaicInstallationExpense } from "shared";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import { getLabelForPhotovoltaicInstallationExpensePurpose } from "@/shared/domain/reconversionProject";
import { getLabelForUrbanProjectDevelopmentExpense } from "@/shared/domain/urbanProject";
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
    case "URBAN_BUILDINGS":
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
                label={getLabelForUrbanProjectDevelopmentExpense(
                  purpose as UrbanProjectDevelopmentExpense["purpose"],
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
