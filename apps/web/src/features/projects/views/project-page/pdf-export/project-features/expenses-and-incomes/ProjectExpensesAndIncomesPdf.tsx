import {
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  sumListWithKey,
} from "shared";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
} from "@/shared/core/reconversionProject";

import DataLine from "../../components/DataLine";
import FeaturesSection from "../../components/FeaturesSection";
import { formatMoneyPdf } from "../../format";
import DevelopmentExpenses from "./DevelopmentExpenses";

type Props = {
  sitePurchaseTotalAmount?: number;
  reinstatementCosts?: ReinstatementExpense[];
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  developmentPlanType: ProjectDevelopmentPlanType;
  developmentPlanInstallationExpenses: ProjectFeatures["developmentPlan"]["installationCosts"];
};

export default function ProjectExpensesAndIncomesPdf({
  sitePurchaseTotalAmount,
  reinstatementCosts,
  siteResaleSellingPrice,
  buildingsResaleSellingPrice,
  financialAssistanceRevenues,
  yearlyProjectedExpenses,
  yearlyProjectedRevenues,
  developmentPlanType,
  developmentPlanInstallationExpenses,
}: Props) {
  return (
    <FeaturesSection title="💰 Dépenses et recettes du projet">
      {sitePurchaseTotalAmount !== undefined ? (
        <DataLine
          label="Prix d'achat du site et droits de mutation"
          value={formatMoneyPdf(sitePurchaseTotalAmount)}
          bold
        />
      ) : undefined}
      {!!reinstatementCosts && (
        <>
          <DataLine
            label="Dépenses de remise en état de la friche"
            value={formatMoneyPdf(sumListWithKey(reinstatementCosts, "amount"))}
            noBorder
            bold
          />
          {reinstatementCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForReinstatementExpensePurpose(purpose)}
                value={formatMoneyPdf(amount)}
                isDetails
                key={purpose}
              />
            );
          })}
        </>
      )}
      {developmentPlanInstallationExpenses.length > 0 && (
        <DevelopmentExpenses
          developmentPlanType={developmentPlanType}
          installationCosts={developmentPlanInstallationExpenses}
        />
      )}

      {siteResaleSellingPrice ? (
        <DataLine
          label="Prix de revente du site"
          labelClassName="font-bold"
          value={formatMoneyPdf(siteResaleSellingPrice)}
        />
      ) : undefined}
      {buildingsResaleSellingPrice ? (
        <DataLine
          label="Prix de revente des bâtiments"
          labelClassName="font-bold"
          value={formatMoneyPdf(buildingsResaleSellingPrice)}
        />
      ) : undefined}
      {yearlyProjectedExpenses.length > 0 && (
        <>
          <DataLine
            noBorder
            bold
            label={
              developmentPlanType === "URBAN_PROJECT"
                ? "Dépenses annuelles d'exploitation des bâtiments"
                : "Dépenses annuelles"
            }
            value={formatMoneyPdf(sumListWithKey(yearlyProjectedExpenses, "amount"))}
          />
          {yearlyProjectedExpenses.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForRecurringExpense(purpose)}
                value={formatMoneyPdf(amount)}
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
            label="Aides financières"
            value={formatMoneyPdf(sumListWithKey(financialAssistanceRevenues, "amount"))}
            bold
          />
          {financialAssistanceRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForFinancialAssistanceRevenueSource(source)}
                value={formatMoneyPdf(amount)}
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
            label="Recettes annuelles"
            bold
            value={formatMoneyPdf(sumListWithKey(yearlyProjectedRevenues, "amount"))}
          />
          {yearlyProjectedRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForRecurringRevenueSource(source)}
                value={formatMoneyPdf(amount)}
                isDetails
                key={source}
              />
            );
          })}
        </>
      )}
    </FeaturesSection>
  );
}
