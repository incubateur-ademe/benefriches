import { ReactNode, useState } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCustomSteps from "./UrbanProjectCustomSteps";
import UrbanProjectSpacesIntroduction from "./spaces/introduction";
import SpacesCategoriesSelection from "./spaces/selection";
import UrbanProjectSpaceCategoriesSurfaceAreaDistribution from "./spaces/surface-area";

type Props = {
  currentStep: UrbanProjectCustomCreationStep;
};

const getCurrentStepView = (step: UrbanProjectCustomCreationStep): ReactNode => {
  switch (step) {
    case "SPACES_CATEGORIES_INTRODUCTION":
      return <UrbanProjectSpacesIntroduction />;
    case "SPACES_CATEGORIES_SELECTION":
      return <SpacesCategoriesSelection />;
    case "SPACES_CATEGORIES_SURFACE_AREA":
      return <UrbanProjectSpaceCategoriesSurfaceAreaDistribution />;
  }
};

export default function UrbanProjectCustomCreationStepWizard({ currentStep }: Props) {
  const [isOpen, setOpen] = useState(true);

  return (
    <SidebarLayout
      mainChildren={getCurrentStepView(currentStep)}
      title="Renseignement du projet"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={<UrbanProjectCustomSteps step={currentStep} isExtended={isOpen} />}
    />
  );
}
