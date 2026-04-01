import { useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import { selectPhotovoltaicPowerPlantStepperDataView } from "../../core/renewable-energy/selectors/stepper.selector";

function PhotovoltaicPowerPlantCreationStepperSteps() {
  const { stepCategories } = useAppSelector(selectPhotovoltaicPowerPlantStepperDataView);

  return stepCategories.map(({ title, validation, activity }) => (
    <FormStepperStep key={title} title={title} variant={{ validation, activity }} />
  ));
}

export default PhotovoltaicPowerPlantCreationStepperSteps;
