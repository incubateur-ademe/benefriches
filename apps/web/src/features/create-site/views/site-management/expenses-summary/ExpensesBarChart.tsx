import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getLabelForExpensePurpose } from "@/features/create-site/domain/expenses.functions";
import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  expenses: Expense[];
};

const ExpensesBarChart = ({ expenses }: Props) => {
  const barChartRef = useRef<HighchartsReact.RefObject>(null);

  const barChartOptions: Highcharts.Options = {
    title: { text: "" },
    xAxis: {
      categories: [""],
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
      stackLabels: {
        enabled: true,
        formatter() {
          return `${formatNumberFr(this.total)} € / an`;
        },
      },
    },
    series: expenses.map(({ purpose, amount }) => {
      return {
        name: getLabelForExpensePurpose(purpose),
        data: [amount],
        type: "column",
      };
    }),
  };

  return (
    <div className={fr.cx("fr-mb-2w")} style={{ maxWidth: "500px" }}>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} ref={barChartRef} />
    </div>
  );
};

export default ExpensesBarChart;
