import { ReactNode, useState } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCustomSteps from "./UrbanProjectCustomSteps";
import UrbanSpacesDevelopmentPlanIntroduction from "./spaces/development-plan-introduction";
import GreenSpacesIntroduction from "./spaces/green-spaces/introduction";
import UrbanGreenSpacesSelection from "./spaces/green-spaces/selection";
import UrbanGreenSpacesDistribution from "./spaces/green-spaces/surface-area-distribution";
import UrbanProjectSpacesIntroduction from "./spaces/introduction";
import LivingAndActivitySpacesIntroduction from "./spaces/living-and-activity-spaces/introduction";
import LivingAndActivitySpacesSelection from "./spaces/living-and-activity-spaces/selection";
import LivingAndActivitySpacesDistribution from "./spaces/living-and-activity-spaces/surface-area-distribution";
import SpacesCategoriesSelection from "./spaces/selection";
import UrbanProjectSpaceCategoriesSurfaceAreaDistribution from "./spaces/surface-area";

type Props = {
  currentStep: UrbanProjectCustomCreationStep;
};

const getCurrentStepView = (
  step: UrbanProjectCustomCreationStep,
): Exclude<ReactNode, undefined> => {
  switch (step) {
    case "SPACES_CATEGORIES_INTRODUCTION":
      return <UrbanProjectSpacesIntroduction />;
    case "SPACES_CATEGORIES_SELECTION":
      return <SpacesCategoriesSelection />;
    case "SPACES_CATEGORIES_SURFACE_AREA":
      return <UrbanProjectSpaceCategoriesSurfaceAreaDistribution />;
    case "SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
      return <UrbanSpacesDevelopmentPlanIntroduction />;
    case "GREEN_SPACES_INTRODUCTION":
      return <GreenSpacesIntroduction />;
    case "GREEN_SPACES_SELECTION":
      return <UrbanGreenSpacesSelection />;
    case "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
      return <UrbanGreenSpacesDistribution />;
    case "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION":
      return <LivingAndActivitySpacesIntroduction />;
    case "LIVING_AND_ACTIVITY_SPACES_SELECTION":
      return <LivingAndActivitySpacesSelection />;
    case "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION":
      return <LivingAndActivitySpacesDistribution />;
    case "PUBLIC_SPACES_INTRODUCTION":
      return <div>PUBLIC_SPACES_INTRODUCTION</div>;
    case "SPACES_DEVELOPMENT_PLAN_SUMMARY":
      return <div>SPACES_DEVELOPMENT_PLAN_SUMMARY</div>;
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
