import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CSSProperties, HTMLAttributes } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import classNames from "@/shared/views/clsx";

type Props = {
  formatFn?: (value: number) => string;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
} & HTMLAttributes<HTMLDivElement>;

const getBarChartOptions = (withTooltip: boolean) => {
  const options = withDefaultBarChartOptions({
    tooltip: withTooltip
      ? {
          useHTML: true,
          distance: 25,
          enabled: true,
          format: "{point.tooltipContent}",
        }
      : {
          enabled: false,
        },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        groupPadding: 0,
        colorByPoint: true,
      },
      series: {
        enableMouseTracking: withTooltip ? true : false,
      },
    },
  });

  return {
    ...options,
    chart: {
      ...options.chart,
      height: 480,
    },
  };
};

const getEmoji = (label: string) => {
  const [emoji] = label.split(" ", 1);

  if (emoji && /\p{Emoji}/u.test(emoji)) {
    return emoji;
  }
  return undefined;
};

const ModalBarColoredChart = ({ data, formatFn = formatMonetaryImpact, ...props }: Props) => {
  const style = Object.fromEntries(
    data.map(({ color }, index) => {
      return color ? [`--highcharts-color-${index}`, color] : [];
    }),
  ) as CSSProperties;

  const useCompactStyle = data.length > 4;

  const options: Highcharts.Options = {
    ...getBarChartOptions(useCompactStyle),

    xAxis: {
      labels: {
        useHTML: true,
        autoRotation: undefined,
      },
      categories: data.map(({ label, value }) => {
        const emoji = getEmoji(label);
        const emojiSpan = emoji ? `<span class="tw-text-xl">${emoji}</span>` : "";

        if (useCompactStyle) {
          return emoji ? emojiSpan : label;
        }
        const simpleLabel = emoji ? label.replace(emoji, "") : label;
        return `${emojiSpan}<wbr><strong class="tw-line-clamp-2">${simpleLabel}</strong><br/>${formatFn(value)}`;
      }),
    },
    series: [
      {
        type: "column",
        data: data.map(({ value, label }) => ({
          name: label,
          y: value,
          tooltipContent:
            useCompactStyle &&
            `
            <span>${label}</span>
            <br />
            <span
              class="${
                value > 0
                  ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                  : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light"
              }"
            >
              ${formatFn(value)}
            </span>
          `,
        })),
      },
    ] as Array<Highcharts.SeriesOptionsType>,
  };

  return (
    <div style={style} className={classNames("tw-mb-6", props.className)} {...props}>
      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{ className: "highcharts-no-xaxis" }}
        options={options}
      />
    </div>
  );
};

export default ModalBarColoredChart;
