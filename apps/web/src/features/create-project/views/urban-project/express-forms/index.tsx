import { UrbanProjectExpressCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { HTML_MAIN_TITLE } from "../../mainHtmlTitle";
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
        currentStep === "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION" ? (
          <>
            <HtmlTitle>{`Typologie de projet - Projet urbain express - ${HTML_MAIN_TITLE}`}</HtmlTitle>
            <UrbanProjectExpressCategory />
          </>
        ) : (
          <>
            <HtmlTitle>{`Résultat - Projet urbain express - ${HTML_MAIN_TITLE}`}</HtmlTitle>
            <UrbanProjectCreationResult />
          </>
        )
      }
      title="Renseignement du projet"
      sidebarChildren={<UrbanProjectExpressStepper step={currentStep} />}
    />
  );
}
