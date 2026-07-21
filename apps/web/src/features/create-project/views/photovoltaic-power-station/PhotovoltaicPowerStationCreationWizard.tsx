import { Suspense } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { RenewableEnergyCreationStep } from "../../core/renewable-energy/renewableEnergySteps";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import { getPhotovoltaicPowerStationStepView } from "./stepToComponent";

const HTML_PV_PROJECT_FORM_MAIN_TITLE = `Projet photovoltaïque - ${HTML_MAIN_TITLE}`;

type Props = {
  currentStep: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationCustomCreationWizard({ currentStep }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {getPhotovoltaicPowerStationStepView(currentStep, {
        mainTitle: HTML_PV_PROJECT_FORM_MAIN_TITLE,
      })}
    </Suspense>
  );
}

export default PhotovoltaicPowerStationCustomCreationWizard;
