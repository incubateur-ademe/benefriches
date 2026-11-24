import type { SVGPathArray, Chart } from "highcharts";
import { useMemo } from "react";

import { withDefaultChartOptions } from "@/shared/views/charts";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import { formatMonetaryImpact } from "../../../shared/formatImpactValue";

type Props = {
  cumulativeEconomicBalanceByYear: number[];
  cumulativeIndirectEconomicImpactsByYear: number[];
  cumulativeBalanceByYear: number[];
  projectionYears: string[];
  breakEvenIndex?: number;
  breakEvenYear?: string;
};

const areaChartOptions = withDefaultChartOptions({
  chart: {
    type: "area",
    styledMode: true,
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
    spacingTop: 10,
    height: 374,
    className: "breakeven-graph",
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
    area: {
      allowPointSelect: false,
    },
  },
  legend: {
    events: {
      itemClick: function () {
        return false;
      },
    },
  },
});

export const useGetBreakEventLevelAreaChartProps = ({
  projectionYears,
  breakEvenIndex,
  breakEvenYear,
  cumulativeBalanceByYear,
}: Props) => {
  const options: Highcharts.Options = useMemo(
    () => ({
      ...areaChartOptions,
      yAxis: {
        lineWidth: 1,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [
          Math.min(...cumulativeBalanceByYear),
          0,
          Math.max(...cumulativeBalanceByYear),
        ],
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
      xAxis: {
        categories: projectionYears,
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
          data: cumulativeBalanceByYear.map((val, i) => ({
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
    [cumulativeBalanceByYear, projectionYears, breakEvenYear, breakEvenIndex],
  );
  return { options, containerProps: { className: "breakeven-graph" } };
};

const CHECK_STROKE_COLOR = "#1a3a5c";
const CHECK_COLOR = "#29b6e8";
const CHECK_PATH: [number, number][] = [
  [9, 16],
  [13.5, 20.5],
  [23, 11],
];

const svgLegendCheckString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <circle cx="16" cy="16" r="16" fill="${CHECK_COLOR}"/>
  <path d="M${CHECK_PATH[0]?.join(" ")} L${CHECK_PATH[1]?.join(" ")} L${CHECK_PATH[2]?.join(" ")}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const svgCheckDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgLegendCheckString)}`;

const columnDecorations = new WeakMap<Chart, Highcharts.SVGElement>();

const BADGE_RADIUS = 13;
const BADGE_BORDER = 2;

const getSampleIndices = (totalYear: number, breakEvenIndex: number | undefined) => {
  const indices = new Set<number>();

  if (totalYear === 0) return indices;

  const step = Math.ceil(totalYear / 10);
  for (let i = 0; i < totalYear; i += step) {
    indices.add(i);
  }

  if (!indices.has(totalYear - 1)) {
    indices.add(totalYear - 1);
  }

  if (breakEvenIndex && !indices.has(breakEvenIndex)) {
    indices.add(breakEvenIndex);
  }

  return indices;
};

export function drawColumnDecorations(chart: Chart, bandIndex: number) {
  columnDecorations.get(chart)?.destroy();
  columnDecorations.delete(chart);

  const { renderer, plotTop, plotHeight } = chart;
  const xAxis = chart.xAxis[0];
  if (!xAxis) {
    return;
  }
  const bottom = plotTop + plotHeight;

  const group = renderer.g("breakeven-column-decorations").attr({ zIndex: 5 }).add();
  columnDecorations.set(chart, group);

  // Yaxis
  const xLeft = xAxis.toPixels(-0.5, false);
  const path: SVGPathArray = [
    ["M", xLeft, plotTop],
    ["L", xLeft, bottom],
  ];

  renderer
    .path(path)
    .attr({ stroke: CHECK_STROKE_COLOR, "stroke-width": 1, fill: "none" })
    .add(group);

  if (bandIndex < 0) return;

  // rectangle en pointillés autour de l'année
  const x1 = xAxis.toPixels(bandIndex - 0.5, false);
  const x2 = xAxis.toPixels(bandIndex + 0.5, false);
  renderer
    .rect(x1, plotTop + 8, x2 - x1, plotHeight - 8)
    .attr({
      stroke: CHECK_STROKE_COLOR,
      "stroke-width": 1,
      "stroke-dasharray": "4,4",
      fill: "none",
    })
    .add(group);

  // 3. badge check
  const cx = x1;
  const cy = plotTop + 8;
  const size = BADGE_RADIUS * 2;

  renderer
    .circle(cx, cy, BADGE_RADIUS + BADGE_BORDER)
    .attr({ fill: "#ffffff" })
    .add(group);

  renderer.image(svgCheckDataUrl, cx - size / 2, cy - size / 2, size, size).add(group);
}

export const useGetBreakEventLevelColumnChartProps = ({
  projectionYears,
  breakEvenIndex,
  breakEvenYear,
  cumulativeEconomicBalanceByYear,
  cumulativeIndirectEconomicImpactsByYear,
}: Props) => {
  const sampleIndices = useMemo(
    () => getSampleIndices(projectionYears.length, breakEvenIndex),
    [projectionYears, breakEvenIndex],
  );

  const categories = useMemo(
    () => projectionYears.filter((_, index) => sampleIndices.has(index)),
    [projectionYears, sampleIndices],
  );

  const options: Highcharts.Options = useMemo(
    () =>
      withDefaultChartOptions({
        chart: {
          className: "breakeven-column-graph",
          type: "column",
          styledMode: true,
          spacingBottom: 0,
          spacingLeft: 0,
          spacingRight: 0,
          spacingTop: 10,
          height: 374,
          events: {
            render: function () {
              if (!this.container) {
                return;
              }
              ["#E0A227", "#22AFE5"].forEach((color, colorIndex) => {
                const series = this.container.querySelectorAll<HTMLElement>(
                  `.highcharts-series-${colorIndex}`,
                );
                const serie = series[colorIndex];
                if (serie) {
                  serie.style.setProperty(`--highcharts-color-${colorIndex}`, color);
                }

                const legendItems = this.container.querySelectorAll<HTMLElement>(
                  `.highcharts-legend-item.highcharts-color-${colorIndex}`,
                );
                const legendItem = legendItems[colorIndex];
                if (legendItem) {
                  legendItem.style.setProperty(`--highcharts-color-${colorIndex}`, color);
                }
              });
              drawColumnDecorations(this, breakEvenYear ? categories.indexOf(breakEvenYear) : -1);
            },
          },
        },
        yAxis: {
          lineWidth: 1,
          startOnTick: false,
          endOnTick: false,
          tickPositions: [
            Math.min(
              ...cumulativeEconomicBalanceByYear,
              ...cumulativeIndirectEconomicImpactsByYear,
            ),
            0,
            Math.max(
              ...cumulativeEconomicBalanceByYear,
              ...cumulativeIndirectEconomicImpactsByYear,
            ),
          ],
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
        tooltip: {
          useHTML: true,
          followPointer: true,
          formatter: function () {
            return `<strong>${this.series.name}</strong><br><span class="fr-badge fr-badge--sm bg-blue-dark text-white">${this.key}</span> <span class='font-bold ${getPositiveNegativeTextClassesFromValue(this.y ?? 0)}'>${formatMonetaryImpact(this.y ?? 0)}</span>`;
          },
        },

        legend: {
          align: "left",
          symbolRadius: 3,
          symbolHeight: 15,
          symbolWidth: 15,
          symbolPadding: 8,
          events: {
            itemClick: function () {
              return false;
            },
          },
        },
        xAxis: {
          categories: categories,
          minPadding: 0.05,
        },
        series: [
          {
            name: "Bilan de l’opération",
            color: "#E0A227",
            type: "column",
            data: cumulativeEconomicBalanceByYear.filter((_, index) => sampleIndices.has(index)),
          },
          {
            name: "Impacts socio-économiques",
            color: "#22AFE5",
            type: "column",
            data: cumulativeIndirectEconomicImpactsByYear.filter((_, index) =>
              sampleIndices.has(index),
            ),
          },
          {
            name: "Année où les impacts compensent le bilan",
            type: "line",
            data: [],
            showInLegend: true,
            enableMouseTracking: false,
            marker: {
              symbol: `url(data:image/svg+xml;charset=UTF-8, ${encodeURIComponent(svgLegendCheckString)})`,
              radius: 8,
              fillColor: "#29b6e8",
              lineWidth: 0,
              width: 18,
              height: 18,
            },
            lineWidth: 0,
          },
        ],
      }),
    [
      cumulativeEconomicBalanceByYear,
      cumulativeIndirectEconomicImpactsByYear,
      categories,
      sampleIndices,
      breakEvenYear,
    ],
  );

  return { options, containerProps: { className: "breakeven-column-graph" } };
};
