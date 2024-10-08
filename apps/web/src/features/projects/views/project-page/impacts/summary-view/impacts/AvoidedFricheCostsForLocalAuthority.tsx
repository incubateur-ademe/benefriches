import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  actorName: string;
  amount: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryAvoidedFricheCostsForLocalAuthority = ({
  actorName,
  amount,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={`${formatMonetaryImpact(amount)} économisés par ${actorName} grâce à la reconversion de la friche`}
        title="- de dépenses de sécurisation&nbsp;💰"
        descriptionDisplayMode={descriptionDisplayMode}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatMonetaryImpact(amount)} toujours à la charge de ${actorName}`}
      title="Des dépenses de sécurisation demeurent&nbsp;💸"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryAvoidedFricheCostsForLocalAuthority;
