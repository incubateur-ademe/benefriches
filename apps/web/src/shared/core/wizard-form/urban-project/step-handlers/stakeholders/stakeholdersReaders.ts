import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

import { ReadStateHelper } from "../../../helpers/readState";

type StepsState = WizardFormState["urbanProject"]["steps"];

export function isDeveloperBuildingsConstructor(stepsState: StepsState): boolean {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      ?.developerWillBeBuildingsConstructor ?? false
  );
}
