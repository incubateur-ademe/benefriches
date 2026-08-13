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
        <div className="text-xs!">
          {data.map(({ label, difference, color }) => (
            <div key={label} className="py-1 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="min-h-3 min-w-3 rounded-sm"
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
