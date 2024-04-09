import { fr } from "@codegouvfr/react-dsfr";
import { formatEvolutionPercentage } from "../../../shared/formatImpactValue";

type Props = {
  percentage: number;
};

export default function ImpactPercentageVariation({ percentage }: Props) {
  return (
    <div
      className={fr.cx("fr-text--sm", "fr-text--bold", "fr-m-0")}
      style={{ textAlign: "center" }}
    >
      {formatEvolutionPercentage(percentage)}
    </div>
  );
}
