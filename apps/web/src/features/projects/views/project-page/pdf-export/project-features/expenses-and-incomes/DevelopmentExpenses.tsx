import {
  PhotovoltaicInstallationExpense,
  sumListWithKey,
  UrbanProjectDevelopmentExpense,
} from "shared";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import { getLabelForPhotovoltaicInstallationExpensePurpose } from "@/shared/core/reconversionProject";
import { getLabelForUrbanProjectDevelopmentExpense } from "@/shared/core/urbanProject";

import DataLine from "../../components/DataLine";
import { formatMoneyPdf } from "../../format";

type DevelopmentPlanInstallationExpensesProps = {
  developmentPlanType: ProjectDevelopmentPlanType;
  installationCosts: ProjectFeatures["developmentPlan"]["installationCosts"];
};
export default function DevelopmentPlanInstallationExpenses({
  developmentPlanType,
  installationCosts,
}: DevelopmentPlanInstallationExpensesProps) {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (
        <>
          <DataLine
            noBorder
            label="Dépenses d'installation de la centrale photovoltaïque"
            bold
            value={formatMoneyPdf(
              sumListWithKey(installationCosts as PhotovoltaicInstallationExpense[], "amount"),
            )}
          />
          {installationCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForPhotovoltaicInstallationExpensePurpose(
                  purpose as PhotovoltaicInstallationExpense["purpose"],
                )}
                value={formatMoneyPdf(amount)}
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
            label="Dépenses d'aménagement du projet urbain"
            value={formatMoneyPdf(
              sumListWithKey(installationCosts as UrbanProjectDevelopmentExpense[], "amount"),
            )}
            noBorder
            bold
          />
          {installationCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForUrbanProjectDevelopmentExpense(
                  purpose as UrbanProjectDevelopmentExpense["purpose"],
                )}
                value={formatMoneyPdf(amount)}
                isDetails
                key={purpose}
              />
            );
          })}
        </>
      );
  }
}
