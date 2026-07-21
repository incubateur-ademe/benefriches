import { useAppSelector } from "@/app/hooks/store.hooks";
import SoilsDecontaminationIntroduction from "@/features/create-project/views/project-form/common/soils-decontamination/introduction/SoilsDecontaminationIntroduction";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

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
