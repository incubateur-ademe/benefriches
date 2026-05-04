import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Fragment, useRef } from "react";

import { withDefaultChartOptions } from "@/shared/views/charts";
import useExportConfig from "@/shared/views/charts/useExportConfig";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";
import ExportChartMenuItems from "@/shared/views/components/Charts/ExportChartMenuItems";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";

import { formatMonetaryImpact } from "../../shared/formatImpactValue";
// oxlint-disable-next-line import/no-unassigned-import
import "./BreakEvenLevelChart.css";

type Props = {
  values: number[];
  xValues: string[];
  breakEvenIndex?: number;
  breakEvenYear?: string;
};

const BreakEvenLevelChart = ({ values, xValues, breakEvenIndex, breakEvenYear }: Props) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const exportConfig = useExportConfig({ title: "📈 Évolution de la balance coût-bénéfice" });

  return (
    <div
      className={classNames(
        "relative",
        "p-6",
        "rounded-2xl",
        "flex",
        "flex-col",
        "justify-between",
        "bg-white",
        "dark:bg-black",
        "border",
        "border-solid",
        "border-border-grey",
        "cursor-pointer",
        "hover:border-current focus:border-current",
        "transition ease-in-out duration-500",
      )}
    >
      <div className="flex justify-between mb-2">
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl">📈 Évolution de la balance coût-bénéfice</h3>
        </div>

        <div className="flex">
          <Menu>
            <MenuButton as={Fragment}>
              <Button
                title="Menu"
                priority="tertiary no outline"
                iconId="ri-download-2-line"
                className="text-text-light"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </MenuButton>
            <MenuItems anchor="bottom end" transition className={classNames(MENU_ITEMS_CLASSES)}>
              <ExportChartMenuItems chartRef={chartRef} exportConfig={exportConfig} />
            </MenuItems>
          </Menu>
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartRef}
        containerProps={{ className: "breakeven-graph" }}
        options={withDefaultChartOptions({
          chart: {
            type: "area",
            styledMode: true,
            height: 500,
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

              marker: {
                enabled: false,
                symbol: "circle",
                radius: 2,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
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
                  xValues[i] === breakEvenYear
                    ? {
                        enabled: true,
                        className: "breakeven-marker",
                      }
                    : { enabled: false },
              })),
            },
          ],
        })}
      />
    </div>
  );
};

export default BreakEvenLevelChart;
