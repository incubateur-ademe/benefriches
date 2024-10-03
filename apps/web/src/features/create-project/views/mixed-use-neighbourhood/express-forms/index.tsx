import { useState } from "react";
import MixedUseNeighbourhoodCreationResult from "./creation-result";
import UrbanProjectExpressStepper from "./UrbanProjectExpressStepper";

import { MixedUseNeighbourhoodExpressCreationStep } from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

type Props = {
  currentStep: MixedUseNeighbourhoodExpressCreationStep;
};

export default function UrbanProjectExpressCreationStepWizard({ currentStep }: Props) {
  const [isOpen, setOpen] = useState(true);

  return (
    <SidebarLayout
      mainChildren={<MixedUseNeighbourhoodCreationResult />}
      title="Renseignement du projet"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={<UrbanProjectExpressStepper step={currentStep} isExtended={isOpen} />}
    />
  );
}
