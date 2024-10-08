import Badge from "@/shared/views/components/Badge/Badge";

import { formatEvolutionPercentage } from "../../../../shared/formatImpactValue";

type Props = {
  percentage: number;
};

export default function ImpactPercentageVariation({ percentage }: Props) {
  return (
    <Badge
      small
      style={percentage === 0 ? "neutral" : percentage > 0 ? "success" : "error"}
      className="tw-ml-2"
    >
      {formatEvolutionPercentage(percentage)}
    </Badge>
  );
}
