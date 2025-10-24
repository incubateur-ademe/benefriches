import SoilsDecontaminationIntroduction from "@/features/create-project/views/common-views/soils-decontamination/introduction/SoilsDecontaminationIntroduction";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SoilsDecontaminationIntroductionContainer() {
  const { onBack, onNext, selectSiteContaminatedSurfaceArea } = useProjectForm();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
