import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { completeSoilsDecontaminationIntroduction } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import SoilsDecontaminationIntroduction from "@/shared/views/project-form/common/soils-decontamination/introduction/SoilsDecontaminationIntroduction";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={() => dispatch(completeSoilsDecontaminationIntroduction())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
