import {
  completeSoilsDecontaminationSurfaceArea,
  revertSoilsDecontaminationSurfaceAreaStep,
} from "@/features/create-project/application/createProject.reducer";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationSurfaceArea, { FormValues } from "./SoilsDecontaminationSurfaceArea";

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
