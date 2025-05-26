import {
  AVERAGE_PROPERTY_TAXES_RATE,
  AVERAGE_RENTAL_VALUE_PER_SQUARE_METERS,
  EXPENSES_EURO_PER_HECTARE_PER_YEAR,
  ILLEGAL_DUMPING_COST_PER_TON,
  ILLEGAL_DUMPING_ESTIMATED_RATIO,
  ILLEGAL_DUMPING_TON_PER_INHABITANT_PER_YEAR,
  MAINTENANCE_COST_BY_BUILDING_SQUARE_METER_PER_YEAR,
  SECURITY_COST_BY_HECTARE_PER_YEAR,
  SiteYearlyExpensePurpose,
  sumListWithKey,
} from "shared";
import { INCOMES_EURO_PER_HECTARE_PER_YEAR } from "shared/src/site/agricultural-operation/yearlyIncomes";

import { getLabelForExpensePurpose } from "@/features/create-site/core/expenses.functions";
import { getLabelForIncomeSource } from "@/features/create-site/core/incomes.functions";
import { formatNumberFr, formatPercentage } from "@/shared/core/format-number/formatNumber";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import { SiteFeatures } from "../core/siteFeatures";

type Props = SiteFeatures;

type Expense = {
  amount: number;
  purpose: SiteYearlyExpensePurpose;
};

export default function SiteFeaturesManagementSection(siteFeatures: Props) {
  const siteManagementExpenses = [
    "maintenance",
    "rent",
    "propertyTaxes",
    "operationsTaxes",
    "otherManagementCosts",
    "otherOperationsCosts",
  ]
    .map((purpose) => siteFeatures.expenses.find((e) => e.purpose === purpose))
    .filter<Expense>((element) => !!element);

  if (siteFeatures.nature === "FRICHE") {
    const fricheSpecificExpenses = ["security", "illegalDumpingCost", "otherSecuringCosts"]
      .map((purpose) => siteFeatures.expenses.find((e) => e.purpose === purpose))
      .filter<Expense>((element) => !!element);

    return (
      <Section
        title="⚙️ Gestion et sécurisation de la friche"
        tooltip="Une friche, bien qu’elle soit sans activité, induit des dépenses importantes, de manière directe (ex : taxe foncière) ou de  indirecte (lorsque le site se détériore)."
      >
        <>
          <DataLine label={<strong>Propriétaire actuel</strong>} value={siteFeatures.ownerName} />
          {siteFeatures.tenantName && (
            <DataLine label="Locataire actuel" value={siteFeatures.tenantName} />
          )}
        </>
        <>
          {siteFeatures.expenses.length > 0 && (
            <DataLine
              noBorder
              label={<strong>Dépenses annuelles de la friche</strong>}
              valueTooltip="On considère ici que la friche fait l’objet de mesures de gestion et de sécurisation. Les montants des dépenses sont calculés d'après les superficies que vous avez renseignées et des dépenses représentatives (exprimées en €/m²)."
              style="monetary"
              value={sumListWithKey(siteFeatures.expenses, "amount")}
            />
          )}
          {siteManagementExpenses.length > 0 && (
            <>
              {fricheSpecificExpenses.length > 0 && (
                <DataLine isDetails label={<strong>Gestion du site</strong>} value="" />
              )}
              {siteManagementExpenses.map(({ purpose, amount }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={amount}
                    style="monetary"
                    labelTooltip={(() => {
                      switch (purpose) {
                        case "propertyTaxes":
                          return "La friche comportant des bâtiments industriels, le propriétaire est toujours redevable de la taxe foncière.";
                        case "maintenance":
                          return "Les dépenses d’entretien peuvent concerner la tonte d’espaces verts ou la taille de haies, la réparation d’actes de vandalisme ou parfois le maintien hors gel de bâtiments, et le règlement de factures associées (eau, gaz, électricité).";
                      }
                    })()}
                    valueTooltip={(() => {
                      switch (purpose) {
                        case "propertyTaxes":
                          return `Le montant de la taxe foncière est calculé en multipliant la valeur locative cadastrale par les taux d’imposition applicables. Le taux moyen utilisé est de ${formatPercentage(AVERAGE_PROPERTY_TAXES_RATE * 100)} et la valeur locative cadastrale de ${AVERAGE_RENTAL_VALUE_PER_SQUARE_METERS * 0.5}€/m²bâtiments. Source : economie.gouv.fr.`;
                        case "maintenance":
                          return `Le coût moyen d’entretien est estimé à près de ${MAINTENANCE_COST_BY_BUILDING_SQUARE_METER_PER_YEAR}€/m² bâtiment/an.`;
                      }
                    })()}
                    isDetails
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          {fricheSpecificExpenses.length > 0 && (
            <>
              <DataLine isDetails label={<strong>Sécurisation du site</strong>} value="" />
              {fricheSpecificExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={amount}
                    labelTooltip={(() => {
                      switch (purpose) {
                        case "security":
                          return "Le gardiennage du site est nécessaire afin d’éviter qu’il ne fasse l’objet de dégradation volontaire, de vandalisme ou de squats, engendrant une perte de la valeur du bien voire une augmentation des dépenses de réhabilitation.";
                        case "illegalDumpingCost":
                          return "Des dépôts sauvages peuvent être constatées sur le site du fait de son abandon.";
                      }
                    })()}
                    valueTooltip={(() => {
                      switch (purpose) {
                        case "security":
                          return `Le coût moyen de gardiennage est estimé à près de ${SECURITY_COST_BY_HECTARE_PER_YEAR / 1000}k€/ha/an.`;
                        case "illegalDumpingCost":
                          return `Montant obtenu en multipliant le ratio de production moyen national de déchets retrouvés dans les dépôts sauvages (${ILLEGAL_DUMPING_TON_PER_INHABITANT_PER_YEAR * 1000} kg/habitant/an) par le coût moyen de gestion de ces déchets (${ILLEGAL_DUMPING_COST_PER_TON} €/tonne) et par un facteur d’occurrence (estimé égal à ${ILLEGAL_DUMPING_ESTIMATED_RATIO}).`;
                      }
                    })()}
                    style="monetary"
                    isDetails
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          {siteFeatures.incomes.length > 0 && (
            <>
              <DataLine
                noBorder
                label={<strong>Recettes annuelles du site</strong>}
                value={sumListWithKey(siteFeatures.incomes, "amount")}
                style="monetary"
              />
              {siteFeatures.incomes.map(({ source, amount }) => {
                return (
                  <DataLine
                    label={getLabelForIncomeSource(source)}
                    value={amount}
                    style="monetary"
                    isDetails
                    key={source}
                  />
                );
              })}
            </>
          )}
        </>
      </Section>
    );
  }
  if (siteFeatures.nature === "AGRICULTURAL_OPERATION") {
    return (
      <Section
        title="⚙️ Exploitation du site"
        tooltip="L’exploitation du site génère des recettes (vente de la production, subvention, etc.) mais occasionne des dépenses (loyers, impôts et taxes, etc.)."
      >
        <>
          <DataLine label={<strong>Propriétaire actuel</strong>} value={siteFeatures.ownerName} />
          {siteFeatures.tenantName && (
            <DataLine label="Exploitant actuel" value={siteFeatures.tenantName} />
          )}
        </>
        <>
          {siteFeatures.expenses.length > 0 && (
            <DataLine
              noBorder
              label={<strong>Dépenses annuelles du site</strong>}
              valueTooltip="Les montants pré-remplis (exprimés en € HT) le sont d'après la surface que vous avez renseignée et les données économiques moyennes documentées pour ce type d’exploitation. Source : AGRESTE  / Réseau d’information comptable agricole"
              value={sumListWithKey(siteFeatures.expenses, "amount")}
              style="monetary"
            />
          )}
          {siteManagementExpenses.map(({ purpose, amount }) => {
            const value = (() => {
              if (!siteFeatures.agriculturalOperationActivity) {
                return undefined;
              }
              switch (purpose) {
                case "otherOperationsCosts":
                  return EXPENSES_EURO_PER_HECTARE_PER_YEAR[
                    siteFeatures.agriculturalOperationActivity
                  ].otherOperationsCosts;
                case "rent":
                  return EXPENSES_EURO_PER_HECTARE_PER_YEAR[
                    siteFeatures.agriculturalOperationActivity
                  ].rent;
                case "operationsTaxes":
                  return EXPENSES_EURO_PER_HECTARE_PER_YEAR[
                    siteFeatures.agriculturalOperationActivity
                  ].operationsTaxes;
              }
            })();
            return (
              <DataLine
                label={getLabelForExpensePurpose(purpose)}
                labelTooltip={
                  purpose === "otherOperationsCosts"
                    ? "Selon le type d’exploitation sélectionnée : charges spécifiques pour les végétaux (engrais, semences, plants, etc.) ou les animaux (alimentation, etc.)."
                    : undefined
                }
                value={amount}
                style="monetary"
                valueTooltip={
                  value
                    ? `Les montants pré-remplis (exprimés en € HT) le sont d'après la surface que vous avez renseignée et les données économiques moyennes documentées pour ce type d’exploitation${value ? `, soit ${formatNumberFr(value)} €/ha` : ""}. Source: AGRESTE / Réseau d’information comptable agricole`
                    : undefined
                }
                isDetails
                key={purpose}
              />
            );
          })}
          {siteFeatures.incomes.length > 0 && (
            <>
              <DataLine
                noBorder
                label={<strong>Recettes annuelles du site</strong>}
                value={sumListWithKey(siteFeatures.incomes, "amount")}
                style="monetary"
                valueTooltip="Les montants pré-remplis (exprimés en € HT) le sont d'après la surface que vous avez renseignée et les données économiques moyennes documentées pour ce type d’exploitation. Source : AGRESTE / Réseau d’information comptable agricole"
              />
              {siteFeatures.incomes.map(({ source, amount }) => {
                const value = (() => {
                  if (!siteFeatures.agriculturalOperationActivity) {
                    return undefined;
                  }
                  switch (source) {
                    case "product-sales":
                      return INCOMES_EURO_PER_HECTARE_PER_YEAR[
                        siteFeatures.agriculturalOperationActivity
                      ].productSales;
                    case "other":
                      return INCOMES_EURO_PER_HECTARE_PER_YEAR[
                        siteFeatures.agriculturalOperationActivity
                      ].other;
                    case "subsidies":
                      return INCOMES_EURO_PER_HECTARE_PER_YEAR[
                        siteFeatures.agriculturalOperationActivity
                      ].subsidies;
                  }
                })();
                return (
                  <DataLine
                    label={getLabelForIncomeSource(source)}
                    value={amount}
                    style="monetary"
                    valueTooltip={
                      value
                        ? `Les montants pré-remplis (exprimés en € HT) le sont d'après la surface que vous avez renseignée et les données économiques moyennes documentées pour ce type d’exploitation${value ? `, soit ${formatNumberFr(value)} €/ha` : ""}. Source: AGRESTE / Réseau d’information comptable agricole`
                        : undefined
                    }
                    labelTooltip={
                      source === "other"
                        ? "Selon le type d’exploitation sélectionnée : charges spécifiques pour les végétaux (engrais, semences, plants, etc.) ou les animaux (alimentation, etc.)."
                        : undefined
                    }
                    isDetails
                    key={source}
                  />
                );
              })}
            </>
          )}
        </>
      </Section>
    );
  }

  return (
    <Section title="⚙️ Gestion du site">
      <>
        <DataLine label={<strong>Propriétaire actuel</strong>} value={siteFeatures.ownerName} />
        {siteFeatures.tenantName && (
          <DataLine label={<strong>Locataire actuel</strong>} value={siteFeatures.tenantName} />
        )}
      </>
      <>
        {siteFeatures.expenses.length > 0 && (
          <DataLine
            noBorder
            label={<strong>Dépenses annuelles du site</strong>}
            style="monetary"
            value={sumListWithKey(siteFeatures.expenses, "amount")}
          />
        )}
        {siteManagementExpenses.length > 0 && (
          <>
            {siteManagementExpenses.map(({ purpose, amount }) => {
              return (
                <DataLine
                  label={getLabelForExpensePurpose(purpose)}
                  style="monetary"
                  value={amount}
                  isDetails
                  key={purpose}
                />
              );
            })}
          </>
        )}
        {siteFeatures.incomes.length > 0 && (
          <>
            <DataLine
              noBorder
              label={<strong>Recettes annuelles du site</strong>}
              value={sumListWithKey(siteFeatures.incomes, "amount")}
              style="monetary"
            />
            {siteFeatures.incomes.map(({ source, amount }) => {
              return (
                <DataLine
                  label={getLabelForIncomeSource(source)}
                  style="monetary"
                  value={amount}
                  isDetails
                  key={source}
                />
              );
            })}
          </>
        )}
      </>
    </Section>
  );
}
