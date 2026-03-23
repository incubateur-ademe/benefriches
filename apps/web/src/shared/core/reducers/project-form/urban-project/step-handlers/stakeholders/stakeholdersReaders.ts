import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { ReadStateHelper } from "../../helpers/readState";

type StepsState = ProjectFormState["urbanProject"]["steps"];

export function isDeveloperBuildingsConstructor(stepsState: StepsState): boolean {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      ?.developerWillBeBuildingsConstructor ?? false
  );
}
