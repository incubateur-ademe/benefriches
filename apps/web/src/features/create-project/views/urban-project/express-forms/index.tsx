import { useState } from "react";

import { UrbanProjectExpressCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectExpressStepper from "./UrbanProjectExpressStepper";
import UrbanProjectCreationResult from "./creation-result";

type Props = {
  currentStep: UrbanProjectExpressCreationStep;
};

export default function UrbanProjectExpressCreationStepWizard({ currentStep }: Props) {
  const [isOpen, setOpen] = useState(true);

  return (
    <SidebarLayout
      mainChildren={<UrbanProjectCreationResult />}
      title="Renseignement du projet"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={<UrbanProjectExpressStepper step={currentStep} isExtended={isOpen} />}
    />
  );
}
