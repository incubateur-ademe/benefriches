import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { completeSoilsDecontaminationSurfaceArea } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { soilsDecontaminationSurfaceAreaStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectContaminatedSurfaceAreaPercentageToDecontaminate } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationSurfaceArea from "../../../common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);
  const surfaceAreaToDecontaminateInPercentage = useAppSelector(
    selectContaminatedSurfaceAreaPercentageToDecontaminate,
  );

  const onSubmit = (surfaceArea: number) => {
    dispatch(completeSoilsDecontaminationSurfaceArea(surfaceArea));
  };

  return (
    <SoilsDecontaminationSurfaceArea
      initialValues={{
        percentSurfaceArea: surfaceAreaToDecontaminateInPercentage,
      }}
      contaminatedSoilSurface={contaminatedSurfaceArea}
      onSubmit={onSubmit}
      onBack={() => dispatch(soilsDecontaminationSurfaceAreaStepReverted())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
