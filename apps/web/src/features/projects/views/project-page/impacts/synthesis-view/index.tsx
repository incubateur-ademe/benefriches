import ImpactSynthesisView from "./ImpactSynthesisView";

import {
  getCategoryFilter,
  getSyntheticImpactsList,
} from "@/features/projects/application/projectImpactsSynthetics.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

const ImpactsSynthesisViewContainer = () => {
  const categoryFilter = useAppSelector(getCategoryFilter);
  const syntheticImpactsList = useAppSelector(getSyntheticImpactsList);

  return (
    <ImpactSynthesisView
      categoryFilter={categoryFilter}
      syntheticImpactsList={syntheticImpactsList}
    />
  );
};

export default ImpactsSynthesisViewContainer;
