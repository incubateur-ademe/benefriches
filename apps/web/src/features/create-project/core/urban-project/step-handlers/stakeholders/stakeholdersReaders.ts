import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type StepsState = UrbanProjectStepsState;

export function isDeveloperBuildingsConstructor(stepsState: StepsState): boolean {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      ?.developerWillBeBuildingsConstructor ?? false
  );
}
