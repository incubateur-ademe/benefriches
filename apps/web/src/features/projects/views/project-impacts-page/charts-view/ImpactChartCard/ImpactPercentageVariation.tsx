import { fr } from "@codegouvfr/react-dsfr";
import { formatEvolutionPercentage } from "../../../shared/formatImpactValue";

import classNames from "@/shared/views/clsx";

type Props = {
  percentage: number;
};

export default function ImpactPercentageVariation({ percentage }: Props) {
  return (
    <div className={classNames(fr.cx("fr-text--sm", "fr-text--bold", "fr-m-0"), "tw-text-center")}>
      {formatEvolutionPercentage(percentage)}
    </div>
  );
}
