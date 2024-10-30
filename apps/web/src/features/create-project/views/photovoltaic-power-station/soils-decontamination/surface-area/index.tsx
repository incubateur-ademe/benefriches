import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import {
  completeSoilsDecontaminationSurfaceArea,
  revertSoilsDecontaminationSurfaceAreaStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationSurfaceArea, {
  FormValues,
} from "../../../common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  const onSubmit = (data: FormValues) => {
    dispatch(completeSoilsDecontaminationSurfaceArea(data.surfaceArea));
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