import { useAppDispatch } from "@/app/hooks/store.hooks";
import SoilsTransformationIntroduction from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/introduction/SoilsTransformationIntroduction";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";

function SoilsTransformationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationIntroduction
      onNext={() => dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested())}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default SoilsTransformationIntroductionContainer;
