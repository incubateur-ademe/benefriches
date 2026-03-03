import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import SoilsDecontaminationIntroduction from "@/shared/views/project-form/common/soils-decontamination/introduction/SoilsDecontaminationIntroduction";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={() => dispatch(navigateToNext())}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
