import { useState } from "react";
import UrbanProjectCreationResult from "./creation-result";
import UrbanProjectExpressStepper from "./UrbanProjectExpressStepper";

import { UrbanProjectExpressCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

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
