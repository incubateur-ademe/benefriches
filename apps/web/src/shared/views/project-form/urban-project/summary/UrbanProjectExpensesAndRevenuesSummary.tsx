import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import {
  EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL,
  EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION,
  EURO_PER_SQUARE_METERS_FOR_DEMOLITION,
  EURO_PER_SQUARE_METERS_FOR_REMEDIATION,
  EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT,
  roundToInteger,
  sumListWithKey,
  URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_DEVELOPMENT_WORKS,
  URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_TECHNICAL_STUDIES,
} from "shared";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
} from "@/shared/core/reconversionProject";
import { getLabelForUrbanProjectDevelopmentExpense } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import { UrbanProjectFormSummaryProps } from "./UrbanProjectFormSummary";

type Props = {
  buttonProps?: ButtonProps;
  warning?: string;
} & Pick<
  UrbanProjectFormSummaryProps["projectSummary"],
  | "buildingsFloorSurfaceArea"
  | "yearlyProjectedCosts"
  | "yearlyProjectedRevenues"
  | "sitePurchaseTotalAmount"
  | "siteResaleExpectedSellingPrice"
  | "financialAssistanceRevenues"
  | "reinstatementCosts"
  | "installationCosts"
  | "buildingsResaleExpectedSellingPrice"
>;

export default function UrbanProjectExpensesAndRevenuesSummary({
  buttonProps,
  buildingsFloorSurfaceArea,
  yearlyProjectedCosts,
  yearlyProjectedRevenues,
  sitePurchaseTotalAmount,
  siteResaleExpectedSellingPrice,
  financialAssistanceRevenues,
  reinstatementCosts,
  installationCosts,
  buildingsResaleExpectedSellingPrice,
  warning,
}: Props) {
  const hasExpensesOrRevenues =
    yearlyProjectedCosts.value.length > 0 ||
    yearlyProjectedRevenues.value.length > 0 ||
    installationCosts.value.length > 0 ||
    sitePurchaseTotalAmount ||
    siteResaleExpectedSellingPrice ||
    buildingsResaleExpectedSellingPrice ||
    financialAssistanceRevenues ||
    reinstatementCosts;

  if (!hasExpensesOrRevenues) {
    return (
      <Section
        title="💰 Dépenses et recettes du projet"
        buttonProps={buttonProps}
        warning={warning}
      >
        Aucune dépense ou revenu renseigné.
      </Section>
    );
  }

  return (
    <Section title="💰 Dépenses et recettes du projet" buttonProps={buttonProps} warning={warning}>
      {sitePurchaseTotalAmount.shouldDisplay ? (
        <DataLine
          label={<strong>Prix d'achat du site et droits de mutation</strong>}
          value={
            <strong>
              {sitePurchaseTotalAmount.value
                ? formatMoney(sitePurchaseTotalAmount.value)
                : "Non renseigné"}
            </strong>
          }
        />
      ) : undefined}
      {reinstatementCosts.shouldDisplay && (
        <>
          <DataLine
            noBorder
            label={<strong>Dépenses de remise en état de la friche</strong>}
            labelTooltip="Le recyclage foncier impose une phase de remise en état, avant aménagement : déconstruction, désamiantage, désimperméabilisation des sols, dépollution des milieux (sols, eaux souterraines, …),  restauration écologique des sols, etc. Cette phase génère des dépenses parfois importantes."
            value={
              <strong>
                {reinstatementCosts.value
                  ? formatMoney(sumListWithKey(reinstatementCosts.value, "amount"))
                  : "Non renseigné"}
              </strong>
            }
          />
          {reinstatementCosts.value?.map(({ amount, purpose }) => {
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
                valueTooltip={
                  reinstatementCosts.autoValues?.includes(purpose)
                    ? (() => {
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
                      })()
                    : undefined
                }
              />
            );
          })}
        </>
      )}
      <DataLine
        noBorder
        label={<strong>Dépenses d'aménagement du projet urbain</strong>}
        value={<strong>{formatMoney(sumListWithKey(installationCosts.value, "amount"))}</strong>}
      />
      {installationCosts.value.map(({ amount, purpose }) => {
        return (
          <DataLine
            label={getLabelForUrbanProjectDevelopmentExpense(purpose)}
            value={formatMoney(amount)}
            isDetails
            key={purpose}
            valueTooltip={
              installationCosts.autoValues?.includes(purpose)
                ? (() => {
                    switch (purpose) {
                      case "development_works":
                        return `Le coût moyen des travaux d'aménagement est estimé à ${(URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_DEVELOPMENT_WORKS * 1000) / 10000} k€/ha. Cette valeur est issue du retour d'expérience ADEME.`;
                      case "technical_studies":
                        return `Le coût moyen des études et honoraires techniques est estimé à ${(URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_TECHNICAL_STUDIES * 1000) / 10000} k€/ha. Cette valeur est issue du retour d'expérience ADEME.`;
                      case "other":
                        return `Le coût moyen des autres dépenses d'aménagement est estimé à 5.4 k€/ha. Cette valeur est issue du retour d'expérience ADEME.`;
                    }
                  })()
                : undefined
            }
          />
        );
      })}

      {siteResaleExpectedSellingPrice.shouldDisplay
        ? (() => {
            if (siteResaleExpectedSellingPrice.isAuto) {
              return (
                <DataLine
                  label={<strong>Prix de revente du site</strong>}
                  value={
                    <strong>
                      {siteResaleExpectedSellingPrice.value
                        ? formatMoney(siteResaleExpectedSellingPrice.value)
                        : "Non renseigné"}
                    </strong>
                  }
                  valueTooltip={
                    buildingsFloorSurfaceArea.value && siteResaleExpectedSellingPrice.value
                      ? `Le prix de revente du site est calculé sur la base de charges foncières estimées à ${roundToInteger(siteResaleExpectedSellingPrice.value / buildingsFloorSurfaceArea.value)} €/m²SDP de bâtiment. Cette valeur est issue du retour d'expérience ADEME.`
                      : undefined
                  }
                />
              );
            }

            return (
              <DataLine
                label={<strong>Prix de revente du site</strong>}
                value={
                  <strong>
                    {siteResaleExpectedSellingPrice.value
                      ? formatMoney(siteResaleExpectedSellingPrice.value)
                      : "Non renseigné"}
                  </strong>
                }
              />
            );
          })()
        : undefined}
      {buildingsResaleExpectedSellingPrice.shouldDisplay ? (
        <DataLine
          label={<strong>Prix de revente des bâtiments</strong>}
          value={
            <strong>
              {buildingsResaleExpectedSellingPrice.value
                ? formatMoney(buildingsResaleExpectedSellingPrice.value)
                : "Non renseigné"}
            </strong>
          }
        />
      ) : undefined}
      <DataLine
        noBorder
        label={<strong>Dépenses annuelles d'exploitation des bâtiments</strong>}
        value={
          <div>
            <strong>{formatMoney(sumListWithKey(yearlyProjectedCosts.value, "amount"))}</strong>
          </div>
        }
      />
      {yearlyProjectedCosts.value.map(({ amount, purpose }) => {
        return (
          <DataLine
            label={getLabelForRecurringExpense(purpose)}
            value={formatMoney(amount)}
            isDetails
            key={purpose}
          />
        );
      })}

      <>
        <DataLine
          noBorder
          label={<strong>Aides financières</strong>}
          value={
            <strong>
              {financialAssistanceRevenues.value
                ? formatMoney(sumListWithKey(financialAssistanceRevenues.value, "amount"))
                : "Non renseigné"}
            </strong>
          }
        />
        {financialAssistanceRevenues.value?.map(({ amount, source }) => {
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
      <DataLine
        noBorder
        label={
          <div>
            <strong>Recettes annuelles</strong>
          </div>
        }
        value={
          <div>
            <strong>{formatMoney(sumListWithKey(yearlyProjectedRevenues.value, "amount"))}</strong>
          </div>
        }
      />
      {yearlyProjectedRevenues.value.map(({ amount, source }) => {
        return (
          <DataLine
            label={getLabelForRecurringRevenueSource(source)}
            value={formatMoney(amount)}
            isDetails
            key={source}
          />
        );
      })}
    </Section>
  );
}
