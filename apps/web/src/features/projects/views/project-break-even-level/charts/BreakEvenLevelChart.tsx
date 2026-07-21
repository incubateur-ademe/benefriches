import * as Highcharts from "highcharts";
import { useMemo } from "react";

import { withDefaultChartOptions } from "@/shared/views/charts";
import useExportConfig from "@/shared/views/charts/useExportConfig";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import ImpactChartCard from "../../shared/charts/ImpactChartCard";
import { formatMonetaryImpact } from "../../shared/formatImpactValue";
// oxlint-disable-next-line import/no-unassigned-import
import "./BreakEvenLevelChart.css";

type Props = {
  values: number[];
  xValues: string[];
  breakEvenIndex?: number;
  breakEvenYear?: string;
  dialogId: string;
};

const BreakEvenLevelChart = ({
  values,
  xValues,
  breakEvenIndex,
  breakEvenYear,
  dialogId,
}: Props) => {
  const exportConfig = useExportConfig({ title: "📈 Évolution de la balance coût-bénéfice" });

  const options: Highcharts.Options = useMemo(
    () =>
      withDefaultChartOptions({
        chart: {
          type: "area",
          styledMode: true,
          spacingBottom: 0,
          spacingLeft: 0,
          spacingRight: 0,
          spacingTop: 10,
          height: 374,
        },
        yAxis: {
          lineWidth: 1,
          startOnTick: false,
          endOnTick: false,
          tickPositions: [Math.min(...values), 0, Math.max(...values)],
          tickWidth: 0,
          plotLines: [
            {
              value: 0,
              width: 1,
              color: "#ccc",
              zIndex: 2,
            },
          ],
          title: { text: undefined },
          labels: {
            format: "{value:,.0f} €",
          },
          maxPadding: 0.1,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          useHTML: true,
          formatter: function () {
            return `<span class="fr-badge fr-badge--sm bg-blue-dark text-white">${this.key}</span> <span class='font-bold ${getPositiveNegativeTextClassesFromValue(this.y ?? 0)}'>${formatMonetaryImpact(this.y ?? 0)}</span>`;
          },
        },

        plotOptions: {
          series: {
            events: {
              legendItemClick: function () {
                return false;
              },
            },
          },
          area: {
            allowPointSelect: false,
          },
        },
        xAxis: {
          categories: xValues,
          lineWidth: 0,
          tickInterval: 5,
          plotLines: [
            { value: 0 },
            {
              value: breakEvenIndex,
              dashStyle: "Dot",
              zIndex: 5,
              className: "breakeven-plotline",
              label: {
                rotation: 0,
                useHTML: true,
                text: `<div class="breakeven-badge">
                        ${breakEvenYear}
                        <span class="breakeven-badge__check">✓</span>
                      </div>`,
                verticalAlign: "bottom",
                textAlign: "center",
                y: -25,
                x: 0,
              },
            },
          ],
        },
        series: [
          {
            type: "area",
            name: "Impacts socio-économiques moins le bilan de l’opération",
            data: values.map((val, i) => ({
              y: val,
              marker:
                i === breakEvenIndex
                  ? {
                      radius: 10,
                      enabled: true,
                    }
                  : {
                      lineColor: "transparent",
                      fillColor: "transparent",
                      radius: 0,
                      enabled: false,
                    },
            })),
          },
        ],
      }),
    [values, xValues, breakEvenYear, breakEvenIndex],
  );

  return (
    <ImpactChartCard
      title="📈 Évolution de la balance coût-bénéfice"
      options={options}
      containerProps={{ className: "breakeven-graph" }}
      dialogId={dialogId}
      exportingOptions={exportConfig}
    />
  );
};

export default BreakEvenLevelChart;
