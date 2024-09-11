import ImpactSynthesisModal from "./ImpactSynthesisModal";

import {
  getEvaluationPeriod,
  getSyntheticImpactsList,
} from "@/features/projects/application/projectImpactsSynthetics.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

const ImpactSynthesisModalContainer = () => {
  const syntheticImpactsList = useAppSelector(getSyntheticImpactsList);
  const evaluationPeriod = useAppSelector(getEvaluationPeriod);

  return (
    <ImpactSynthesisModal
      syntheticImpactsList={syntheticImpactsList}
      evaluationPeriod={evaluationPeriod}
    />
  );
};

export default ImpactSynthesisModalContainer;
