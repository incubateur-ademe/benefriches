import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundTo2Digits } from "shared";

import { SocioEconomicImpactByActor } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActor;
};

function SocioEconomicImpactsByActorChart({ socioEconomicImpacts }: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: socioEconomicImpacts.map(({ name }) => `<strong>${getActorLabel(name)}</strong>`),
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y ? formatMonetaryImpact(this.y) : "";
          },
          crop: false,
          overflow: "allow",
        },
      },
    },
    tooltip: {
      format: "{point.impactsList}",

      useHTML: true,
    },
    series: [
      {
        name: "Impact socio-économique",
        type: "column",
        data: socioEconomicImpacts.map(({ total, impacts, name }) => ({
          name: getActorLabel(name),
          y: roundTo2Digits(total),
          type: "column",
          impactsList: impacts
            .map(({ name, value }) => {
              const classes =
                value === 0
                  ? "tw-text-impacts-neutral-main dark:tw-text-impacts-neutral-light"
                  : value > 0
                    ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                    : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light";

              return `<div
                key="${name}"
                class="tw-flex tw-justify-between tw-items-center tw-max-w-[200] tw-gap-2"
              >
                <div class="tw-flex tw-items-center tw-gap-2">
                  <span>${getSocioEconomicImpactLabel(name)}</span>
                </div>

                <span
                  class="tw-py-1 tw-pr-4 ${classes}"
                >
                  ${formatMonetaryImpact(value)}
                </span>
              </div>`;
            })
            .join(""),
        })),
      },
    ],
  };
  return (
    <HighchartsReact
      containerProps={{ className: "highcharts-no-xaxis" }}
      highcharts={Highcharts}
      options={barChartOptions}
    />
  );
}

export default SocioEconomicImpactsByActorChart;
