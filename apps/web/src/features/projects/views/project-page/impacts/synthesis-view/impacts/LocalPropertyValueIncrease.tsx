import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  value: number;
  small?: boolean;
};

const ImpactSynthesisLocalPropertyValueIncrease = ({ value, ...props }: Props) => {
  return (
    <ImpactSyntheticCard
      {...props}
      type="success"
      tooltipText={`${formatMonetaryImpact(value)} de valeur patrimoniale attendue par la reconversion de la friche`}
      text="+ d’attractivité&nbsp;🏡"
    />
  );
};

export default ImpactSynthesisLocalPropertyValueIncrease;
