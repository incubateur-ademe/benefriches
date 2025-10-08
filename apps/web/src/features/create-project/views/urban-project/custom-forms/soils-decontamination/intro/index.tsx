import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import SoilsDecontaminationIntroduction from "@/features/create-project/views/common-views/soils-decontamination/introduction/SoilsDecontaminationIntroduction";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";

function SoilsDecontaminationIntroductionContainer() {
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  const { onNext, onBack } = useInformationalStepBackNext();

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
