import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import {
  soilsDecontaminationSurfaceAreaCompleted,
  soilsDecontaminationSurfaceAreaReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import SoilsDecontaminationSurfaceArea, {
  FormValues,
} from "@/features/create-project/views/common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={contaminatedSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(soilsDecontaminationSurfaceAreaCompleted(data.surfaceArea));
      }}
      onBack={() => dispatch(soilsDecontaminationSurfaceAreaReverted())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
