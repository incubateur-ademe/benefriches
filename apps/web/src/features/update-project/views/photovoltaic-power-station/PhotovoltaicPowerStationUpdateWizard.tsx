import { Suspense } from "react";

import type { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import { getPhotovoltaicPowerStationStepView } from "@/features/create-project/views/photovoltaic-power-station/stepToComponent";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

const HTML_PV_UPDATE_FORM_MAIN_TITLE = "Modification du projet photovoltaïque";

type Props = {
  currentStep: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationUpdateWizard({ currentStep }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {getPhotovoltaicPowerStationStepView(currentStep, {
        mainTitle: HTML_PV_UPDATE_FORM_MAIN_TITLE,
      })}
    </Suspense>
  );
}

export default PhotovoltaicPowerStationUpdateWizard;
