import { useRef } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getLabelForExpensePurpose } from "@/features/create-site/domain/expenses.functions";
import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  ownerExpenses: Expense[];
  tenantExpenses: Expense[];
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

const ExpensesBarChart = ({ ownerExpenses, tenantExpenses, ownerName, tenantName }: Props) => {
  const barChartRef = useRef<HighchartsReact.RefObject>(null);

  const ownerTotal = ownerExpenses.reduce((total, { amount }) => total + amount, 0);
  const tenantTotal = tenantExpenses.reduce((total, { amount }) => total + amount, 0);

  const expenses = [
    ...ownerExpenses.map(({ purpose, amount }) => {
      return {
        name: getLabelForExpensePurpose(purpose),
        data: [-amount],
        type: "column",
        color: getColorForPurpose(purpose),
      };
    }),
    ...tenantExpenses.map(({ purpose, amount }) => {
      return {
        name: getLabelForExpensePurpose(purpose),
        data: [0, -amount],
        type: "column",
        color: getColorForPurpose(purpose),
      };
    }),
  ];

  const barChartOptions: Highcharts.Options = {
    title: { text: "" },
    xAxis: {
      categories: [
        `<strong>${ownerName ? `${ownerName} (propriétaire)` : "Propriétaire"}</strong><br>${formatNumberFr(-ownerTotal)} €/an`,
        `<strong>${tenantName ? `${tenantName} (locataire)` : "Locataire"}</strong><br>${formatNumberFr(-tenantTotal)} €/an`,
      ],
      lineWidth: 0,
      type: "category",
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
      title: { text: "" },
      plotLines: [
        {
          value: 0,
          width: 2,
          color: "#929292",
        },
      ],
      gridLineWidth: 0,
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
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} ref={barChartRef} />
    </div>
  );
};

export default ExpensesBarChart;
