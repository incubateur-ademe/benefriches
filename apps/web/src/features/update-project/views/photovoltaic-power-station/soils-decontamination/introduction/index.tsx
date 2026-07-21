import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import SoilsDecontaminationIntroduction from "@/features/create-project/views/project-form/common/soils-decontamination/introduction/SoilsDecontaminationIntroduction";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectSiteContaminatedSurfaceArea } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={() => dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested())}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
