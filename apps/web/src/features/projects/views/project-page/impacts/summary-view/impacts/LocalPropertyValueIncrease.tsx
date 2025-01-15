import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryLocalPropertyValueIncrease = ({ value, onClick, noDescription }: Props) => {
  return (
    <KeyImpactIndicatorCard
      type="success"
      description={
        noDescription
          ? undefined
          : `${formatMonetaryImpact(value)} de valeur patrimoniale attendue par la reconversion de la friche`
      }
      title="Un cadre de vie amélioré&nbsp;🏡"
      onClick={onClick}
    />
  );
};

export default ImpactSummaryLocalPropertyValueIncrease;
