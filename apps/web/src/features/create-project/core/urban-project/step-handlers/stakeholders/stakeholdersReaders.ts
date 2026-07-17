import type { WizardFormState } from "@/features/create-project/core/urban-project/urbanProjectForm.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type StepsState = WizardFormState["urbanProject"]["steps"];

export function isDeveloperBuildingsConstructor(stepsState: StepsState): boolean {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      ?.developerWillBeBuildingsConstructor ?? false
  );
}
