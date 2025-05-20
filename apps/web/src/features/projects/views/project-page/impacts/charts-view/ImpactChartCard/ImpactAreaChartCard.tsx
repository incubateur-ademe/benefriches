import useImpactAreaChartProps from "@/features/projects/views/shared/charts/useImpactAreaChartProps";

import ImpactChartCard from "./ImpactChartCard";

type Props = {
  title: string;
  base: number;
  forecast: number;
  difference: number;
  dialogId: string;

  color?: string;
  details?: { label: string; base: number; forecast: number; difference: number; color?: string }[];
  type?: "co2" | "surfaceArea" | "etp" | "default";
  height?: number;
};

function ImpactAreaChartCard({ title, dialogId, ...props }: Props) {
  const { options, colors, chartContainerId } = useImpactAreaChartProps({
    title,
    ...props,
  });

  return (
    <ImpactChartCard
      title={title}
      dialogId={dialogId}
      exportingOptions={{ colors, colorBySeries: true }}
      containerProps={{
        id: chartContainerId,
      }}
      options={options}
      classes={{ title: "tw-text-xl" }}
    />
  );
}

export default ImpactAreaChartCard;
