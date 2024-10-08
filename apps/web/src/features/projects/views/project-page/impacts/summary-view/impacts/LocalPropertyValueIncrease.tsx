import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryLocalPropertyValueIncrease = ({ value, descriptionDisplayMode }: Props) => {
  return (
    <KeyImpactIndicatorCard
      type="success"
      description={`${formatMonetaryImpact(value)} de valeur patrimoniale attendue par la reconversion de la friche`}
      title="+ d’attractivité&nbsp;🏡"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryLocalPropertyValueIncrease;
