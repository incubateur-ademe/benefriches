import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { ControlButtonProps } from "../../impact-description-modals/ImpactModalDescriptionContext";
import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  actorName: string;
  amount: number;
  isSuccess: boolean;
  buttonProps: ControlButtonProps;
  noDescription?: boolean;
};

const ImpactSummaryAvoidedFricheCostsForLocalAuthority = ({
  actorName,
  amount,
  isSuccess,
  buttonProps,
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
        buttonProps={buttonProps}
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
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryAvoidedFricheCostsForLocalAuthority;
