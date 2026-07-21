import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import SoilsTransformationProjectForm, { FormValues } from "./SoilsTransformationProjectForm";

function SoilsTransformationProjectFormContainer() {
  const { onBack, onRequestStepCompletion, selectSoilsTransformationProjectSelectionViewData } =
    useRenewableEnergyForm();
  const { initialValues } = useAppSelector(selectSoilsTransformationProjectSelectionViewData);

  return (
    <SoilsTransformationProjectForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
          answers: { soilsTransformationProject: data.soilsTransformationProject },
        });
      }}
      onBack={onBack}
    />
  );
}

export default SoilsTransformationProjectFormContainer;
