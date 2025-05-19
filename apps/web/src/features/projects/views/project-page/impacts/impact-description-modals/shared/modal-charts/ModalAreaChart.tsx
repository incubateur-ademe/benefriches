import Tooltip from "@codegouvfr/react-dsfr/Tooltip";

import useImpactAreaChartProps, {
  ImpactAreaChartProps,
} from "@/features/projects/views/shared/charts/useImpactAreaChartProps";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import ExportableChart from "@/shared/views/components/Charts/ExportableChart";

type Props = ImpactAreaChartProps;

const ModalAreaChart = (props: Props) => {
  const { options, data, formatFn, chartContainerId } = useImpactAreaChartProps({
    height: 300,
    ...props,
  });

  return (
    <Tooltip
      kind="hover"
      title={
        <div className="!tw-text-xs">
          {data.map(({ label, difference, color }) => (
            <div
              key={label}
              className="tw-py-1 tw-flex tw-justify-between tw-items-center tw-gap-2"
            >
              <div className="tw-flex tw-items-center tw-gap-2">
                <span
                  className="tw-min-h-3 tw-min-w-3 tw-rounded"
                  style={color ? { backgroundColor: color } : {}}
                ></span>
                <span>{label}</span>
              </div>

              <span className={getPositiveNegativeTextClassesFromValue(difference)}>
                {formatFn(difference)}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <ExportableChart
        containerProps={{ id: chartContainerId }}
        exportingOptions={{
          title: props.title,
          colors: data.map(({ color }) => color),
          colorBySeries: true,
        }}
        options={options}
      />
    </Tooltip>
  );
};

export default ModalAreaChart;
