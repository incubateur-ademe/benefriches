import { formatEvolutionPercentage } from "../../../../shared/formatImpactValue";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

type Props = {
  percentage: number;
};

export default function ImpactPercentageVariation({ percentage }: Props) {
  return (
    <Badge
      small
      className={classNames(
        percentage === 0
          ? "tw-bg-impacts-neutral-main dark:tw-bg-impacts-neutral-light"
          : percentage > 0
            ? "tw-bg-impacts-positive-light"
            : "tw-bg-impacts-negative-light",
        "tw-ml-2",
      )}
    >
      {formatEvolutionPercentage(percentage)}
    </Badge>
  );
}
