import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  actorName: string;
  amount: number;
  isSuccess: boolean;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryAvoidedFricheCostsForLocalAuthority = ({
  actorName,
  amount,
  isSuccess,
  onClick,
  noDescription,
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={
          noDescription
            ? undefined
            : `${formatMonetaryImpact(amount)} économisés par ${actorName} grâce à la reconversion de la friche`
        }
        title="- de dépenses de sécurisation&nbsp;💰"
        onClick={onClick}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={
        noDescription
          ? undefined
          : `${formatMonetaryImpact(amount)} toujours à la charge de ${actorName}`
      }
      title="Des dépenses de sécurisation demeurent&nbsp;💸"
      onClick={onClick}
    />
  );
};

export default ImpactSummaryAvoidedFricheCostsForLocalAuthority;
