import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  value: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSynthesisTaxesIncome = ({ value, isSuccess, descriptionDisplayMode }: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={`${formatMonetaryImpact(value)} à venir au profit notamment de la collectivité`}
        title="+ de recettes fiscales&nbsp;💰"
        descriptionDisplayMode={descriptionDisplayMode}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatMonetaryImpact(value)} en moins pour, notamment, la collectivité`}
      title="- de recettes fiscales&nbsp;💸"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSynthesisTaxesIncome;
