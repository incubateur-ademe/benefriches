import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type Props = {
  expenses: { label: string; amount: number }[];
};

const ExpensesPieChart = ({ expenses }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const data = expenses.map(({ label, amount }) => {
    return {
      name: label,
      y: amount,
    };
  });

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: "Marianne",
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "Montant : <strong>{point.y} € / an</strong> ({point.percentage:.1f}%)",
    },
    plotOptions: { pie: { cursor: "pointer" } },
    series: [
      {
        name: "Coût annuel",
        type: "pie",
        data,
      },
    ],
  };

  return (
    <div className={fr.cx("fr-mb-2w")} style={{ maxWidth: "500px" }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={variablePieChartOptions}
        ref={variablePieChartRef}
      />
    </div>
  );
};

export default ExpensesPieChart;
