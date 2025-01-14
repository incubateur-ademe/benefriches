import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import {
  soilsDecontaminationSurfaceAreaCompleted,
  soilsDecontaminationSurfaceAreaReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectContaminatedSurfaceAreaPercentageToDecontaminate } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import SoilsDecontaminationSurfaceArea from "@/features/create-project/views/common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);
  const surfaceAreaToDecontaminateInPercentage = useAppSelector(
    selectContaminatedSurfaceAreaPercentageToDecontaminate,
  );

  return (
    <SoilsDecontaminationSurfaceArea
      initialValues={{
        percentSurfaceArea: surfaceAreaToDecontaminateInPercentage,
      }}
      contaminatedSoilSurface={contaminatedSurfaceArea}
      onSubmit={(surfaceArea: number) => {
        dispatch(soilsDecontaminationSurfaceAreaCompleted(surfaceArea));
      }}
      onBack={() => dispatch(soilsDecontaminationSurfaceAreaReverted())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
