import { ReactNode, useState } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCustomSteps from "./UrbanProjectCustomSteps";
import SoilsDecontaminationIntroduction from "./soils-decontamination/intro";
import SoilsDecontaminationSelection from "./soils-decontamination/selection";
import SoilsDecontaminationSurfaceArea from "./soils-decontamination/surface-area";
import UrbanSpacesDevelopmentPlanIntroduction from "./spaces/development-plan-introduction";
import GreenSpacesIntroduction from "./spaces/green-spaces/introduction";
import UrbanGreenSpacesSelection from "./spaces/green-spaces/selection";
import UrbanGreenSpacesDistribution from "./spaces/green-spaces/surface-area-distribution";
import UrbanProjectSpacesIntroduction from "./spaces/introduction";
import LivingAndActivitySpacesIntroduction from "./spaces/living-and-activity-spaces/introduction";
import LivingAndActivitySpacesSelection from "./spaces/living-and-activity-spaces/selection";
import LivingAndActivitySpacesDistribution from "./spaces/living-and-activity-spaces/surface-area-distribution";
import PublicSpacesIntroduction from "./spaces/public-spaces/introduction";
import PublicSpacesSelection from "./spaces/public-spaces/selection";
import PublicSpacesDistribution from "./spaces/public-spaces/surface-area-distribution";
import SpacesCategoriesSelection from "./spaces/selection";
import UrbanProjectSoilsCarbonStorage from "./spaces/soils-carbon-storage";
import UrbanProjectSoilsSummary from "./spaces/soils-summary/";
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
      return <PublicSpacesIntroduction />;
    case "PUBLIC_SPACES_SELECTION":
      return <PublicSpacesSelection />;
    case "PUBLIC_SPACES_DISTRIBUTION":
      return <PublicSpacesDistribution />;
    case "SPACES_SOILS_SUMMARY":
      return <UrbanProjectSoilsSummary />;
    case "SOILS_CARBON_SUMMARY":
      return <UrbanProjectSoilsCarbonStorage />;
    case "SOILS_DECONTAMINATION_INTRODUCTION":
      return <SoilsDecontaminationIntroduction />;
    case "SOILS_DECONTAMINATION_SELECTION":
      return <SoilsDecontaminationSelection />;
    case "SOILS_DECONTAMINATION_SURFACE_AREA":
      return <SoilsDecontaminationSurfaceArea />;
    case "BUILDINGS_INTRODUCTION":
      return <div>BUILDINGS_INTRODUCTION</div>;
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
