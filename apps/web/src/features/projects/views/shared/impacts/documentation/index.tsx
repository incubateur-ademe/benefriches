import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";

import ImpactsComputationMethodology from "./ImpactDocumentation";

const ImpactDocumentationContainer = () => {
  const { useBetaAmenageScoreView } = useAppSelector(selectAppSettings);

  return <ImpactsComputationMethodology displayDevelopmentScore={useBetaAmenageScoreView} />;
};

export default ImpactDocumentationContainer;
