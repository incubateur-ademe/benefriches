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

const ExpensesBarChart = ({ ownerExpenses, tenantExpenses, ownerName, tenantName }: Props) => {
  const barChartRef = useRef<HighchartsReact.RefObject>(null);

  const ownerTotal = ownerExpenses.reduce((total, { amount }) => total + amount, 0);
  const tenantTotal = tenantExpenses.reduce((total, { amount }) => total + amount, 0);

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
      backgroundColor: "transparent",
      style: { fontFamily: "Marianne" },
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
    series: [
      ...(ownerExpenses.map(({ purpose, amount }) => {
        return {
          name: getLabelForExpensePurpose(purpose),
          data: [-amount],
          type: "column",
        };
      }) as Array<Highcharts.SeriesOptionsType>),
      ...(tenantExpenses.map(({ purpose, amount }) => {
        return {
          name: getLabelForExpensePurpose(purpose),
          data: [0, -amount],
          type: "column",
        };
      }) as Array<Highcharts.SeriesOptionsType>),
    ],
  };

  return (
    <div className="tw-w-full">
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} ref={barChartRef} />
    </div>
  );
};

export default ExpensesBarChart;
