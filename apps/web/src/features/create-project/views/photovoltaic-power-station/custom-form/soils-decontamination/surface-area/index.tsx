import { roundToInteger } from "shared";

import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { completeSoilsDecontaminationSurfaceArea } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectContaminatedSurfaceAreaPercentageToDecontaminate } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { computeValueFromPercentage } from "@/shared/core/percentage/percentage";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SoilsDecontaminationSurfaceArea from "@/shared/views/project-form/common/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";

function SoilsDecontaminationSurfaceAreaContainer() {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);
  const surfaceAreaToDecontaminateInPercentage = useAppSelector(
    selectContaminatedSurfaceAreaPercentageToDecontaminate,
  );

  const onSubmit = (surfaceArea: number) => {
    dispatch(completeSoilsDecontaminationSurfaceArea(surfaceArea));
  };

  const getInitialValues = () => {
    if (surfaceAreaToDecontaminateInPercentage === undefined) {
      return undefined;
    }
    return {
      surfaceArea:
        inputMode === "percentage"
          ? surfaceAreaToDecontaminateInPercentage
          : roundToInteger(
              computeValueFromPercentage(
                surfaceAreaToDecontaminateInPercentage,
                contaminatedSurfaceArea,
              ),
            ),
    };
  };

  return (
    <SoilsDecontaminationSurfaceArea
      initialValues={getInitialValues()}
      contaminatedSoilSurface={contaminatedSurfaceArea}
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onSubmit={onSubmit}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
