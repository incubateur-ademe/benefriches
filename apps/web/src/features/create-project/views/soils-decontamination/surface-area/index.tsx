import SoilsDecontaminationSurfaceArea, { FormValues } from "./SoilsDecontaminationSurfaceArea";

import {
  completeSoilsDecontaminationSurfaceArea,
  revertSoilsDecontaminationSurfaceAreaStep,
} from "@/features/create-project/application/createProject.reducer";
import { selectSiteData } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();

  const siteData = useAppSelector(selectSiteData);

  const onSubmit = (data: FormValues) => {
    dispatch(completeSoilsDecontaminationSurfaceArea(data.surfaceArea));
  };

  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={siteData?.contaminatedSoilSurface ?? 0}
      onSubmit={onSubmit}
      onBack={() => dispatch(revertSoilsDecontaminationSurfaceAreaStep())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
