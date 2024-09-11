import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  actorName: string;
  amount: number;
  isSuccess: boolean;
  small?: boolean;
};

const ImpactSynthesisAvoidedFricheCostsForLocalAuthority = ({
  actorName,
  amount,
  isSuccess,
  ...props
}: Props) => {
  if (isSuccess) {
    return (
      <ImpactSyntheticCard
        {...props}
        type="success"
        tooltipText={`${formatMonetaryImpact(amount)} économisés par ${actorName} grâce à la reconversion de la friche`}
        text="- de dépenses de sécurisation&nbsp;💰"
      />
    );
  }

  return (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${formatMonetaryImpact(amount)} toujours à la charge de ${actorName}`}
      text="Des dépenses de sécurisation demeurent&nbsp;💸"
    />
  );
};

export default ImpactSynthesisAvoidedFricheCostsForLocalAuthority;
