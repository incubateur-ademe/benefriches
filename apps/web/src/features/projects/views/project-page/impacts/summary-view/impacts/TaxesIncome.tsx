import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  isSuccess: boolean;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryTaxesIncome = ({ value, isSuccess, noDescription, ...props }: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={
          noDescription
            ? undefined
            : `${formatMonetaryImpact(value)} à venir au profit notamment de la collectivité`
        }
        title="+ de recettes fiscales&nbsp;💰"
        {...props}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={
        noDescription
          ? undefined
          : `${formatMonetaryImpact(value)} en moins pour, notamment, la collectivité`
      }
      title="- de recettes fiscales&nbsp;💸"
      {...props}
    />
  );
};

export default ImpactSummaryTaxesIncome;
