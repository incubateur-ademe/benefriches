import {
  DevelopmentPlanInstallationExpenses,
  DevelopmentPlanType,
  FinancialAssistanceRevenue,
  RecurringExpensePurpose,
  RecurringRevenue,
  ReinstatementExpensePurpose,
  UrbanSprawlComparisonImpacts,
} from "shared";

import { getEconomicBalanceDetailsImpactLabel } from "../../../project-page/impacts/getImpactLabel";
import TableAccordionRow from "../layout/TableAccordionRows";
import ImpactComparisonTableRow from "../layout/TableRow";
import ImpactComparisonTableSectionRow from "../layout/TableSectionRow";
import ImpactComparisonTableSeparatorRow from "../layout/TableSeparatorRow";

type Props = {
  projectType: DevelopmentPlanType;
  baseCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
  comparisonCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
};

const REINSTATEMENT_PURPOSES: ReinstatementExpensePurpose[] = [
  "asbestos_removal",
  "deimpermeabilization",
  "demolition",
  "other_reinstatement",
  "remediation",
  "sustainable_soils_reinstatement",
  "waste_collection",
];

const INSTALLATION_EXPENSES_PURPOSES: DevelopmentPlanInstallationExpenses["purpose"][] = [
  "technical_studies",
  "installation_works",
  "development_works",
  "other",
];

const OPERATION_COSTS_PURPOSES: RecurringExpensePurpose[] = [
  "rent",
  "maintenance",
  "taxes",
  "other",
];

const FINANCIAL_ASSISTANCE_SOURCES: FinancialAssistanceRevenue["source"][] = [
  "local_or_regional_authority_participation",
  "public_subsidies",
  "other",
];

const OPERATION_REVENUES_SOURCES: RecurringRevenue["source"][] = ["operations", "other", "rent"];

const ImpactComparisonListEconomicBalanceSection = ({
  baseCase,
  comparisonCase,
  projectType,
}: Props) => {
  return (
    <ImpactComparisonTableSectionRow
      label="Bilan de l'opération"
      baseValue={baseCase.impacts.economicBalance.total}
      comparisonValue={comparisonCase.impacts.economicBalance.total}
    >
      {(() => {
        const base = baseCase.impacts.economicBalance.costs.siteReinstatement;
        const comparison = comparisonCase.impacts.economicBalance.costs.siteReinstatement;

        if (!base && !comparison) {
          return null;
        }

        const list = REINSTATEMENT_PURPOSES.map((purpose) => {
          return {
            purpose,
            base: base?.costs.find((cost) => cost.purpose === purpose),
            comparison: comparison?.costs.find((cost) => cost.purpose === purpose),
          };
        }).filter((item) => item.base || item.comparison);

        return (
          <>
            <TableAccordionRow
              label="🚧 Remise en état de la friche"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={-1 * (base?.total ?? 0)}
              comparisonValue={-1 * (comparison?.total ?? 0)}
            >
              {list.map((item, index) => (
                <ImpactComparisonTableRow
                  key={item.purpose}
                  label={getEconomicBalanceDetailsImpactLabel("site_reinstatement", item.purpose)}
                  isLast={index === list.length - 1}
                  baseValue={-1 * (item.base?.amount ?? 0)}
                  comparisonValue={-1 * (item.comparison?.amount ?? 0)}
                />
              ))}
            </TableAccordionRow>
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.costs.developmentPlanInstallation;
        const comparison = comparisonCase.impacts.economicBalance.costs.developmentPlanInstallation;

        if (!base && !comparison) {
          return null;
        }

        const list = INSTALLATION_EXPENSES_PURPOSES.map((purpose) => {
          return {
            purpose,
            base: base?.costs.find((cost) => cost.purpose === purpose),
            comparison: comparison?.costs.find((cost) => cost.purpose === purpose),
          };
        }).filter((item) => item.base || item.comparison);

        return (
          <>
            <TableAccordionRow
              label={
                projectType === "PHOTOVOLTAIC_POWER_PLANT"
                  ? "⚡️ Installation de la centrale photovoltaïque"
                  : "🏘️ Aménagement du site"
              }
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={-1 * (base?.total ?? 0)}
              comparisonValue={-1 * (comparison?.total ?? 0)}
            >
              {list.map((item, index) => (
                <ImpactComparisonTableRow
                  key={item.purpose}
                  label={getEconomicBalanceDetailsImpactLabel(
                    "development_plan_installation",
                    item.purpose,
                  )}
                  isLast={index === list.length - 1}
                  baseValue={-1 * (item.base?.amount ?? 0)}
                  comparisonValue={-1 * (item.comparison?.amount ?? 0)}
                />
              ))}
            </TableAccordionRow>
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.costs.sitePurchase;
        const comparison = comparisonCase.impacts.economicBalance.costs.sitePurchase;

        if (!base && !comparison) {
          return null;
        }

        return (
          <>
            <ImpactComparisonTableRow
              label="🏠 Transaction foncière"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={-1 * (base ?? 0)}
              comparisonValue={-1 * (comparison ?? 0)}
              isFirst
              isLast
            />
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.costs.operationsCosts;
        const comparison = comparisonCase.impacts.economicBalance.costs.operationsCosts;

        if (!base && !comparison) {
          return null;
        }

        const list = OPERATION_COSTS_PURPOSES.map((purpose) => {
          return {
            purpose,
            base: base?.costs.find((cost) => cost.purpose === purpose),
            comparison: comparison?.costs.find((cost) => cost.purpose === purpose),
          };
        }).filter((item) => item.base || item.comparison);

        return (
          <>
            <TableAccordionRow
              label="💸️ Charges d’exploitation"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={-1 * (base?.total ?? 0)}
              comparisonValue={-1 * (comparison?.total ?? 0)}
            >
              {list.map((item, index) => (
                <ImpactComparisonTableRow
                  key={item.purpose}
                  label={getEconomicBalanceDetailsImpactLabel("operations_costs", item.purpose)}
                  isLast={index === list.length - 1}
                  baseValue={-1 * (item.base?.amount ?? 0)}
                  comparisonValue={-1 * (item.comparison?.amount ?? 0)}
                />
              ))}
            </TableAccordionRow>
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.revenues.buildingsResale;
        const comparison = comparisonCase.impacts.economicBalance.revenues.buildingsResale;

        if (!base && !comparison) {
          return null;
        }

        return (
          <>
            <ImpactComparisonTableRow
              label="🏠 Cession foncière"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={base ?? 0}
              comparisonValue={comparison ?? 0}
              isFirst
              isLast
            />
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.revenues.siteResale;
        const comparison = comparisonCase.impacts.economicBalance.revenues.siteResale;

        if (!base && !comparison) {
          return null;
        }

        return (
          <>
            <ImpactComparisonTableRow
              label="🚪 Cession du site"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={base ?? 0}
              comparisonValue={comparison ?? 0}
              isFirst
              isLast
            />
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.revenues.financialAssistance;
        const comparison = comparisonCase.impacts.economicBalance.revenues.financialAssistance;

        if (!base && !comparison) {
          return null;
        }

        const list = FINANCIAL_ASSISTANCE_SOURCES.map((source) => {
          return {
            source,
            base: base?.revenues.find((cost) => cost.source === source),
            comparison: comparison?.revenues.find((cost) => cost.source === source),
          };
        }).filter((item) => item.base || item.comparison);

        return (
          <>
            <TableAccordionRow
              label="🏦 Aides financières"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={base?.total ?? 0}
              comparisonValue={comparison?.total ?? 0}
            >
              {list.map((item, index) => (
                <ImpactComparisonTableRow
                  key={item.source}
                  label={getEconomicBalanceDetailsImpactLabel("financial_assistance", item.source)}
                  isLast={index === list.length - 1}
                  baseValue={item.base?.amount ?? 0}
                  comparisonValue={item.comparison?.amount ?? 0}
                />
              ))}
            </TableAccordionRow>
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}

      {(() => {
        const base = baseCase.impacts.economicBalance.revenues.operationsRevenues;
        const comparison = comparisonCase.impacts.economicBalance.revenues.operationsRevenues;

        if (!base && !comparison) {
          return null;
        }

        const list = OPERATION_REVENUES_SOURCES.map((source) => {
          return {
            source,
            base: base?.revenues.find((cost) => cost.source === source),
            comparison: comparison?.revenues.find((cost) => cost.source === source),
          };
        }).filter((item) => item.base || item.comparison);

        return (
          <>
            <TableAccordionRow
              label="💰 Recettes d’exploitation"
              actor={baseCase.impacts.economicBalance.bearer}
              baseValue={base?.total ?? 0}
              comparisonValue={comparison?.total ?? 0}
            >
              {list.map((item, index) => (
                <ImpactComparisonTableRow
                  key={item.source}
                  label={getEconomicBalanceDetailsImpactLabel("operations_revenues", item.source)}
                  isLast={index === list.length - 1}
                  baseValue={item.base?.amount ?? 0}
                  comparisonValue={item.comparison?.amount ?? 0}
                />
              ))}
            </TableAccordionRow>
            <ImpactComparisonTableSeparatorRow />
          </>
        );
      })()}
    </ImpactComparisonTableSectionRow>
  );
};

export default ImpactComparisonListEconomicBalanceSection;
