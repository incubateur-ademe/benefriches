import { UrbanProjectExpressCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectExpressStepper from "./UrbanProjectExpressStepper";
import UrbanProjectCreationResult from "./creation-result";
import UrbanProjectExpressCategory from "./express-category";

type Props = {
  currentStep: UrbanProjectExpressCreationStep;
};

export default function UrbanProjectExpressCreationStepWizard({ currentStep }: Props) {
  return (
    <SidebarLayout
      mainChildren={
        currentStep === "EXPRESS_CATEGORY_SELECTION" ? (
          <UrbanProjectExpressCategory />
        ) : (
          <UrbanProjectCreationResult />
        )
      }
      title="Renseignement du projet"
      sidebarChildren={<UrbanProjectExpressStepper step={currentStep} />}
    />
  );
}
