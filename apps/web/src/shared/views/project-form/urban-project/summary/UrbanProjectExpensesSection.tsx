import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import {
  EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL,
  EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION,
  EURO_PER_SQUARE_METERS_FOR_DEMOLITION,
  EURO_PER_SQUARE_METERS_FOR_REMEDIATION,
  EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT,
  sumListWithKey,
  URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_DEVELOPMENT_WORKS,
  URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_TECHNICAL_STUDIES,
} from "shared";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import {
  getLabelForRecurringExpense,
  getLabelForReinstatementExpensePurpose,
} from "@/shared/core/reconversionProject";
import { getProjectSummary } from "@/shared/core/reducers/project-form/urban-project/helpers/projectSummary";
import { getLabelForUrbanProjectDevelopmentExpense } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

type ProjectSummary = ReturnType<typeof getProjectSummary>;

type Props = {
  buttonProps?: ButtonProps;
  warning?: string;
  sitePurchaseTotalAmount: ProjectSummary["sitePurchaseTotalAmount"];
  sitePurchasePropertyTransferDuties: ProjectSummary["sitePurchasePropertyTransferDuties"];
  reinstatementCosts: ProjectSummary["reinstatementCosts"];
  installationCosts: ProjectSummary["installationCosts"];
  yearlyProjectedCosts: ProjectSummary["yearlyProjectedCosts"];
  developerName: string | undefined;
  reinstatementContractOwnerName: string | undefined;
};

export default function UrbanProjectExpensesSection({
  buttonProps,
  warning,
  sitePurchaseTotalAmount,
  sitePurchasePropertyTransferDuties,
  reinstatementCosts,
  installationCosts,
  yearlyProjectedCosts,
  developerName,
  reinstatementContractOwnerName,
}: Props) {
  const hasExpenses =
    (sitePurchaseTotalAmount.shouldDisplay && sitePurchaseTotalAmount.value !== undefined) ||
    (reinstatementCosts.shouldDisplay && reinstatementCosts.value !== undefined) ||
    installationCosts.value.length > 0 ||
    yearlyProjectedCosts.value.length > 0;

  if (!hasExpenses) {
    return (
      <Section title="💸 Dépenses" buttonProps={buttonProps} warning={warning}>
        Aucune dépense renseignée.
      </Section>
    );
  }

  const sitePurchaseSellingPrice =
    sitePurchaseTotalAmount.value !== undefined &&
    sitePurchasePropertyTransferDuties.value !== undefined
      ? sitePurchaseTotalAmount.value - sitePurchasePropertyTransferDuties.value
      : undefined;

  return (
    <Section title="💸 Dépenses" buttonProps={buttonProps} warning={warning}>
      {sitePurchaseTotalAmount.shouldDisplay && sitePurchaseTotalAmount.value && (
        <>
          <DataLine
            noBorder
            label={
              <>
                <strong>Acquisition foncière</strong> (à la charge de {developerName})
              </>
            }
            value={<strong>{formatMoney(sitePurchaseTotalAmount.value)}</strong>}
          />
          {sitePurchaseSellingPrice && (
            <DataLine
              label="Prix d'acquisition foncière"
              value={formatMoney(sitePurchaseSellingPrice)}
              isDetails
            />
          )}
        </>
      )}

      {reinstatementCosts.value !== undefined && (
        <>
          <DataLine
            noBorder
            label={
              <>
                <strong>Remise en état du site</strong> (à la charge de{" "}
                {reinstatementContractOwnerName})
              </>
            }
            value={
              <strong>{formatMoney(sumListWithKey(reinstatementCosts.value, "amount"))}</strong>
            }
          />
          {reinstatementCosts.value?.map(({ amount, purpose }) => (
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
          ))}
        </>
      )}

      {installationCosts.value.length > 0 && (
        <>
          <DataLine
            noBorder
            label={
              <>
                <strong>Aménagement du site</strong> (à la charge de {developerName})
              </>
            }
            value={
              <strong>{formatMoney(sumListWithKey(installationCosts.value, "amount"))}</strong>
            }
          />
          {installationCosts.value.map(({ amount, purpose }) => (
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
          ))}
        </>
      )}

      {yearlyProjectedCosts.value.length > 0 && (
        <>
          <DataLine
            noBorder
            label={
              <>
                <strong>Dépenses annuelles d'exploitation des bâtiments</strong> (à la charge de{" "}
                {developerName})
              </>
            }
            value={
              <strong>{formatMoney(sumListWithKey(yearlyProjectedCosts.value, "amount"))}</strong>
            }
          />
          {yearlyProjectedCosts.value.map(({ amount, purpose }) => (
            <DataLine
              label={getLabelForRecurringExpense(purpose)}
              value={formatMoney(amount)}
              isDetails
              key={purpose}
            />
          ))}
        </>
      )}
    </Section>
  );
}
