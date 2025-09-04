import { Route } from "type-route";

import { selectCurrentStep } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import UrbanProjectCustomCreationStepWizardBeta from "./content-wizards/StepWizardBeta";

type Props = {
  route: Route<typeof routes.createProject>;
};
export default function UrbanProjectCustomCreationStepWizardBetaContainer({ route }: Props) {
  const currentStep = useAppSelector(selectCurrentStep);

  return <UrbanProjectCustomCreationStepWizardBeta currentStep={currentStep} route={route} />;
}
