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
    height: 250,
    title,
    ...props,
  });

  return (
    <ImpactChartCard
      dialogId={dialogId}
      exportingOptions={{ colors, colorBySeries: true }}
      containerProps={{
        id: chartContainerId,
        className: ["area-chart"],
      }}
      options={{
        ...options,
        title: { text: title, align: "left", minScale: 1 },
      }}
    />
  );
}

export default ImpactAreaChartCard;
