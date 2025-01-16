import {
  UrbanProjectDevelopmentExpense,
  PhotovoltaicInstallationExpense,
  sumListWithKey,
} from "shared";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForPhotovoltaicInstallationExpensePurpose } from "@/shared/core/reconversionProject";
import { getLabelForUrbanProjectDevelopmentExpense } from "@/shared/core/urbanProject";
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
              <strong>
                {formatNumberFr(
                  sumListWithKey(installationCosts as PhotovoltaicInstallationExpense[], "amount"),
                )}{" "}
                €
              </strong>
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
    case "URBAN_PROJECT":
      return (
        <>
          <DataLine
            noBorder
            label={<strong>Dépenses d'aménagement du quartier</strong>}
            value={
              <strong>
                {formatNumberFr(
                  sumListWithKey(installationCosts as UrbanProjectDevelopmentExpense[], "amount"),
                )}{" "}
                €
              </strong>
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
