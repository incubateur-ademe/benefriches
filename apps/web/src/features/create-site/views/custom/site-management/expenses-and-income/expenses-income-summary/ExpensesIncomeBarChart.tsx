import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";
import {
  SiteYearlyExpense,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  sumListWithKey,
} from "shared";

import { getLabelForExpensePurpose } from "@/features/create-site/core/expenses.functions";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { withDefaultChartOptions } from "@/shared/views/charts";

type Props = {
  ownerExpenses: SiteYearlyExpense[];
  tenantExpenses: SiteYearlyExpense[];
  ownerIncome: SiteYearlyIncome[];
  tenantIncome: SiteYearlyIncome[];
  ownerName?: string;
  tenantName?: string;
};

const getColorForPurpose = (purpose: SiteYearlyExpensePurpose) => {
  switch (purpose) {
    case "accidentsCost":
      return "#13BAEC";
    case "illegalDumpingCost":
      return "#F042D6";
    case "maintenance":
      return "#5C42F0";
    case "operationsTaxes":
    case "propertyTaxes":
    case "taxes":
      return "#4262F0";
    case "otherManagementCosts":
      return "#9542F0";
    case "otherSecuringCosts":
      return "#F0427F";
    case "rent":
      return "#429CF0";
    case "security":
      return "#D042F0";
  }
};

const getColorForSourceIncome = (source: SiteYearlyIncome["source"]): string => {
  switch (source) {
    case "operations":
      return "#37C95D";
    case "other":
      return "#30B151";
    case "rent":
      return "#429CF0";
    default:
      return "#37C95D";
  }
};

const getLabelForOperationsRevenueSource = (source: SiteYearlyIncome["source"]): string => {
  switch (source) {
    case "operations":
      return "Recettes d'exploitation";
    case "product-sales":
      return "Vente de produits";
    case "subsidies":
      return "Subventions";
    case "other":
      return "Autres recettes";
    case "rent":
      return "Revenu locatif";
  }
};

const ExpensesIncomeBarChart = ({
  ownerExpenses,
  tenantExpenses,
  ownerIncome,
  tenantIncome,
  ownerName,
  tenantName,
}: Props) => {
  const barChartRef = useRef<HighchartsReact.RefObject>(null);

  const ownerExpensesTotal = sumListWithKey(ownerExpenses, "amount");
  const tenantExpensesTotal = sumListWithKey(tenantExpenses, "amount");
  const tenantIncomeTotal = sumListWithKey(tenantIncome, "amount");
  const ownerIncomeTotal = sumListWithKey(ownerIncome, "amount");

  const expenses = [
    ...ownerExpenses.map(({ purpose, amount }) => {
      return {
        name: getLabelForExpensePurpose(purpose),
        data: [-amount],
        type: "column",
        color: getColorForPurpose(purpose),
      };
    }),
    ...ownerIncome.map(({ source, amount }) => {
      return {
        name: getLabelForOperationsRevenueSource(source),
        data: [0, amount],
        type: "column",
        color: getColorForSourceIncome(source),
      };
    }),
    ...tenantExpenses.map(({ purpose, amount }) => {
      return {
        name: getLabelForExpensePurpose(purpose),
        data: [0, 0, -amount],
        type: "column",
        color: getColorForPurpose(purpose),
      };
    }),
    ...tenantIncome.map(({ source, amount }) => {
      return {
        name: getLabelForOperationsRevenueSource(source),
        data: [0, 0, 0, amount],
        type: "column",
        color: getColorForSourceIncome(source),
      };
    }),
  ];

  const barChartOptions: Highcharts.Options = withDefaultChartOptions({
    xAxis: {
      categories: [
        `<strong>DÉPENSES<br>${ownerName}</strong><br>${formatNumberFr(-ownerExpensesTotal)} €/an`,
        `<strong>RECETTES<br>${ownerName}</strong><br>${formatNumberFr(ownerIncomeTotal)} €/an`,
        `<strong>DÉPENSES<br>${tenantName}</strong><br>${formatNumberFr(-tenantExpensesTotal)} €/an`,
        `<strong>RECETTES<br>${tenantName}</strong><br>${formatNumberFr(tenantIncomeTotal)} €/an`,
      ],
      lineWidth: 0,
      type: "category",
      opposite: true,
    },

    tooltip: {
      headerFormat: "",
      valueSuffix: " € / an",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        cursor: "pointer",
        pointPadding: 0,
        borderWidth: 0,
      },
    },
    chart: {
      styledMode: true,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      startOnTick: false,
      endOnTick: false,
      tickAmount: 1,
      tickPositions: [0],
    },
    legend: {
      layout: "vertical",
      align: "right",
      width: "33%",
      verticalAlign: "middle",
    },
    series: expenses as Highcharts.SeriesOptionsType[],
  });

  return (
    <div
      className="w-full"
      style={expenses.reduce(
        (style, { color }, index) => ({
          ...style,
          [`--highcharts-color-${index}`]: color,
        }),
        {},
      )}
    >
      <HighchartsReact
        containerProps={{ className: "highcharts-no-xaxis" }}
        highcharts={Highcharts}
        options={barChartOptions}
        ref={barChartRef}
      />
    </div>
  );
};

export default ExpensesIncomeBarChart;
