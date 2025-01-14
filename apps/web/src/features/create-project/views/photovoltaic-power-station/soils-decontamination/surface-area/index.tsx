import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import {
  completeSoilsDecontaminationSurfaceArea,
  revertSoilsDecontaminationSurfaceAreaStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationSurfaceArea from "../../../common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  const onSubmit = (surfaceArea: number) => {
    dispatch(completeSoilsDecontaminationSurfaceArea(surfaceArea));
  };

  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={contaminatedSurfaceArea}
      onSubmit={onSubmit}
      onBack={() => dispatch(revertSoilsDecontaminationSurfaceAreaStep())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
