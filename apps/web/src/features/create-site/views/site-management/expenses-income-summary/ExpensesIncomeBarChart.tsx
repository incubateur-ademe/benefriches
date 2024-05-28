import { useRef } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getLabelForExpensePurpose } from "@/features/create-site/domain/expenses.functions";
import { Expense, Income } from "@/features/create-site/domain/siteFoncier.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  ownerExpenses: Expense[];
  tenantExpenses: Expense[];
  ownerIncome: Income[];
  tenantIncome: Income[];
  ownerName?: string;
  tenantName?: string;
};

const getColorForPurpose = (purpose: Expense["purpose"]) => {
  switch (purpose) {
    case "accidentsCost":
      return "#13BAEC";
    case "illegalDumpingCost":
      return "#F042D6";
    case "maintenance":
      return "#5C42F0";
    case "operationsTaxes":
    case "propertyTaxes":
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

const getColorForSourceIncome = (source: Income["source"]) => {
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

const getLabelForRevenueSource = (source: string) => {
  switch (source) {
    case "operations":
      return "Recettes d’exploitation";
    case "other":
      return "Autres recettes";
    case "rent":
      return "Loyer (propriétaire)";
    default:
      return "Autres";
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

  const ownerExpensesTotal = ownerExpenses.reduce((total, { amount }) => total + amount, 0);
  const tenantExpensesTotal = tenantExpenses.reduce((total, { amount }) => total + amount, 0);
  const tenantIncomeTotal = tenantIncome.reduce((total, { amount }) => total + amount, 0);
  const ownerIncomeTotal = ownerIncome.reduce((total, { amount }) => total + amount, 0);

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
        name: getLabelForRevenueSource(source),
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
        name: getLabelForRevenueSource(source),
        data: [0, 0, 0, amount],
        type: "column",
        color: getColorForSourceIncome(source),
      };
    }),
  ];

  const barChartOptions: Highcharts.Options = {
    title: { text: "" },
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
    credits: {
      enabled: false,
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
    series: expenses as Array<Highcharts.SeriesOptionsType>,
  };

  return (
    <div
      className="tw-w-full"
      style={{
        ...expenses.reduce(
          (style, { color }, index) => ({
            ...style,
            [`--highcharts-color-${index}`]: color,
          }),
          {},
        ),
      }}
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
