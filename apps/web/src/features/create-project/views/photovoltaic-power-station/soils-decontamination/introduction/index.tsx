import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import SoilsDecontaminationIntroduction from "@/features/create-project/views/project-form/common/soils-decontamination/introduction/SoilsDecontaminationIntroduction";

function SoilsDecontaminationIntroductionContainer() {
  const { onNext, onBack } = useRenewableEnergyForm();
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
