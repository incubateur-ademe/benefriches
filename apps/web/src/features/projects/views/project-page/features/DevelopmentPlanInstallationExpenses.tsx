import {
  UrbanProjectDevelopmentExpense,
  PhotovoltaicInstallationExpense,
  sumListWithKey,
  URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_TECHNICAL_STUDIES,
  URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_DEVELOPMENT_WORKS,
} from "shared";

import { PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC } from "@/features/create-project/core/renewable-energy/photovoltaic";
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
                valueTooltip={(() => {
                  switch (purpose) {
                    case "installation_works":
                      return `Le coût moyen des travaux d'installation est estimé à ${(PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.works * 1000) / 10000} €/kWc. Cette valeur est issue du retour d’expérience ADEME.`;
                    case "technical_studies":
                      return `Le coût moyen des études et honoraires techniques est estimé à ${(PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.technicalStudyAmount * 1000) / 10000} €/kWc. Cette valeur est issue du retour d’expérience ADEME.`;
                    case "other":
                      return `Le coût moyen des autres dépenses d'installation est estimé à ${(PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.other * 1000) / 10000} €/kWc. Cette valeur est issue du retour d’expérience ADEME.`;
                  }
                })()}
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
            label={<strong>Dépenses d'aménagement du projet urbain</strong>}
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
                valueTooltip={(() => {
                  switch (purpose) {
                    case "development_works":
                      return `Le coût moyen des travaux d’aménagement est estimé à ${(URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_DEVELOPMENT_WORKS * 1000) / 10000} k€/ha. Cette valeur est issue du retour d’expérience ADEME.`;
                    case "technical_studies":
                      return `Le coût moyen des études et honoraires techniques est estimé à ${(URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_TECHNICAL_STUDIES * 1000) / 10000} k€/ha. Cette valeur est issue du retour d’expérience ADEME.`;
                    case "other":
                      return `Le coût moyen des autres dépenses d'aménagement est estimé à 5.4 k€/ha. Cette valeur est issue du retour d’expérience ADEME.`;
                  }
                })()}
              />
            );
          })}
        </>
      );
  }
}
