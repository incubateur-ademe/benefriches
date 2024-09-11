import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  value: number;
  isSuccess: boolean;
  small?: boolean;
};

const ImpactSynthesisTaxesIncome = ({ value, isSuccess, ...props }: Props) => {
  if (isSuccess) {
    return (
      <ImpactSyntheticCard
        {...props}
        type="success"
        tooltipText={`${formatMonetaryImpact(value)} à venir au profit notamment de la collectivité`}
        text="+ de recettes fiscales&nbsp;💰"
      />
    );
  }

  return (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${formatMonetaryImpact(value)} en moins pour, notamment, la collectivité`}
      text="- de recettes fiscales&nbsp;💸"
    />
  );
};

export default ImpactSynthesisTaxesIncome;
