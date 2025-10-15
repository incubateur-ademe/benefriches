import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import {
  BuildingsUseDistribution,
  DevelopmentPlanType,
  EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL,
  EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION,
  EURO_PER_SQUARE_METERS_FOR_DEMOLITION,
  EURO_PER_SQUARE_METERS_FOR_REMEDIATION,
  EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT,
  roundToInteger,
  sumListWithKey,
  sumObjectValues,
} from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { formatMoney } from "@/shared/core/format-number/formatNumber";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
} from "@/shared/core/reconversionProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import DevelopmentPlanInstallationExpenses from "./DevelopmentPlanInstallationExpenses";

type Props = {
  buttonProps?: ButtonProps;
  buildingsFloorArea?: BuildingsUseDistribution;
  installationCosts: ProjectFeatures["developmentPlan"]["installationCosts"];
  developmentPlanType: DevelopmentPlanType;
  isExpress: boolean;
} & Pick<
  ProjectFeatures,
  | "yearlyProjectedExpenses"
  | "yearlyProjectedRevenues"
  | "sitePurchaseTotalAmount"
  | "buildingsResaleSellingPrice"
  | "financialAssistanceRevenues"
  | "reinstatementCosts"
  | "siteResaleSellingPrice"
>;

export default function ExpensesAndRevenuesSection({
  buttonProps,
  isExpress,
  developmentPlanType,
  buildingsFloorArea,
  yearlyProjectedExpenses,
  yearlyProjectedRevenues,
  sitePurchaseTotalAmount,
  siteResaleSellingPrice,
  buildingsResaleSellingPrice,
  financialAssistanceRevenues,
  reinstatementCosts,
  installationCosts,
}: Props) {
  const hasExpensesOrRevenues =
    yearlyProjectedExpenses.length > 0 ||
    yearlyProjectedRevenues.length > 0 ||
    installationCosts.length > 0 ||
    sitePurchaseTotalAmount ||
    siteResaleSellingPrice ||
    buildingsResaleSellingPrice ||
    financialAssistanceRevenues ||
    reinstatementCosts;

  if (!hasExpensesOrRevenues) {
    return (
      <Section title="💰 Dépenses et recettes du projet" buttonProps={buttonProps}>
        Aucune dépense ou revenu renseigné.
      </Section>
    );
  }

  return (
    <Section title="💰 Dépenses et recettes du projet" buttonProps={buttonProps}>
      {sitePurchaseTotalAmount ? (
        <DataLine
          label={<strong>Prix d'achat du site et droits de mutation</strong>}
          value={<strong>{formatMoney(sitePurchaseTotalAmount)}</strong>}
        />
      ) : undefined}
      {reinstatementCosts && (
        <>
          <DataLine
            noBorder
            label={<strong>Dépenses de remise en état de la friche</strong>}
            labelTooltip="Le recyclage foncier impose une phase de remise en état, avant aménagement : déconstruction, désamiantage, désimperméabilisation des sols, dépollution des milieux (sols, eaux souterraines, …),  restauration écologique des sols, etc. Cette phase génère des dépenses parfois importantes."
            value={<strong>{formatMoney(sumListWithKey(reinstatementCosts, "amount"))}</strong>}
          />
          {reinstatementCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForReinstatementExpensePurpose(purpose)}
                value={formatMoney(amount)}
                isDetails
                key={purpose}
                labelTooltip={(() => {
                  switch (purpose) {
                    case "sustainable_soils_reinstatement":
                      return "La restauration écologique des sols consiste en la restauration des fonctionnalités écologiques des sols comme l'accueil de la biodiversité, le bon fonctionnement des cycles du carbone ou de l'eau.";
                  }
                })()}
                valueTooltip={(() => {
                  switch (purpose) {
                    case "sustainable_soils_reinstatement":
                      return `On considère que pour permettre la renaturation, il y a besoin de restauration écologique des sols qui coûte ${EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT} € / m² de surface de sol enherbé arbustif et sol arboré du projet. Cette valeur est issue du retour d'expérience ADEME.`;
                    case "deimpermeabilization":
                      return `On considère que la réduction de la surface imperméabilisée coûte ${EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION} € / m² surface désimperméabilisée. Cette valeur est issue du retour d'expérience ADEME.`;
                    case "remediation":
                      return `Le coût moyen de dépollution est estimé à ${EURO_PER_SQUARE_METERS_FOR_REMEDIATION} €/m². Cette valeur est issue du retour d'expérience ADEME.`;
                    case "demolition":
                      return `Le coût moyen de déconstruction est estimé à ${EURO_PER_SQUARE_METERS_FOR_DEMOLITION} €/m² de bâtiment. Cette valeur est issue du retour d'expérience ADEME.`;
                    case "asbestos_removal":
                      return `Le coût moyen de désamiantage est estimé à ${EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL} €/m² de bâtiment. Cette valeur est issue du retour d'expérience ADEME.`;
                  }
                })()}
              />
            );
          })}
        </>
      )}
      {installationCosts.length > 0 && (
        <DevelopmentPlanInstallationExpenses
          developmentPlanType={developmentPlanType}
          installationCosts={installationCosts}
        />
      )}

      {siteResaleSellingPrice
        ? (() => {
            if (isExpress && developmentPlanType === "URBAN_PROJECT") {
              const buildingsTotalSurfaceArea = sumObjectValues(buildingsFloorArea ?? {});

              return (
                <DataLine
                  label={<strong>Prix de revente du site</strong>}
                  value={<strong>{formatMoney(siteResaleSellingPrice)}</strong>}
                  valueTooltip={
                    buildingsTotalSurfaceArea
                      ? `Le prix de revente du site est calculé sur la base de charges foncières estimées à ${roundToInteger(siteResaleSellingPrice / buildingsTotalSurfaceArea)} €/m²SDP de bâtiment. Cette valeur est issue du retour d'expérience ADEME.`
                      : undefined
                  }
                />
              );
            }

            return (
              <DataLine
                label={<strong>Prix de revente du site</strong>}
                value={<strong>{formatMoney(siteResaleSellingPrice)}</strong>}
              />
            );
          })()
        : undefined}
      {buildingsResaleSellingPrice ? (
        <DataLine
          label={<strong>Prix de revente des bâtiments</strong>}
          value={<strong>{formatMoney(buildingsResaleSellingPrice)}</strong>}
        />
      ) : undefined}
      {yearlyProjectedExpenses.length > 0 && (
        <>
          <DataLine
            noBorder
            label={
              <strong>
                {developmentPlanType === "URBAN_PROJECT"
                  ? "Dépenses annuelles d'exploitation des bâtiments"
                  : "Dépenses annuelles"}
              </strong>
            }
            value={
              <div>
                <strong>{formatMoney(sumListWithKey(yearlyProjectedExpenses, "amount"))}</strong>
              </div>
            }
          />
          {yearlyProjectedExpenses.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForRecurringExpense(purpose)}
                value={formatMoney(amount)}
                isDetails
                key={purpose}
              />
            );
          })}
        </>
      )}

      {!!financialAssistanceRevenues && (
        <>
          <DataLine
            noBorder
            label={<strong>Aides financières</strong>}
            value={
              <strong>{formatMoney(sumListWithKey(financialAssistanceRevenues, "amount"))}</strong>
            }
          />
          {financialAssistanceRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForFinancialAssistanceRevenueSource(source)}
                value={formatMoney(amount)}
                isDetails
                key={source}
              />
            );
          })}
        </>
      )}
      {yearlyProjectedRevenues.length > 0 && (
        <>
          <DataLine
            noBorder
            label={
              <div>
                <strong>Recettes annuelles</strong>
              </div>
            }
            value={
              <div>
                <strong>{formatMoney(sumListWithKey(yearlyProjectedRevenues, "amount"))}</strong>
              </div>
            }
          />
          {yearlyProjectedRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForRecurringRevenueSource(source)}
                value={formatMoney(amount)}
                isDetails
                key={source}
              />
            );
          })}
        </>
      )}
    </Section>
  );
}
