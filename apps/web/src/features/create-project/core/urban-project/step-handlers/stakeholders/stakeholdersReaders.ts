import { getFutureOperator } from "@/features/create-project/core/project-form/stakeholders";
import type { ProjectStakeholder } from "@/features/create-project/core/project.types";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type StepsState = UrbanProjectStepsState;

export function isDeveloperBuildingsConstructor(stepsState: StepsState): boolean {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      ?.developerWillBeBuildingsConstructor ?? false
  );
}

export function hasBuildingsResalePlannedAfterDevelopment(
  stepsState: StepsState,
): boolean | undefined {
  return ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
  )?.buildingsResalePlannedAfterDevelopment;
}

export function willDeveloperResellBuildings(stepsState: StepsState): boolean {
  return (
    isDeveloperBuildingsConstructor(stepsState) &&
    hasBuildingsResalePlannedAfterDevelopment(stepsState) === true
  );
}

export function readFutureOperator(stepsState: StepsState): ProjectStakeholder | undefined {
  const buildingsDeveloperAnswers = ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
  );
  if (buildingsDeveloperAnswers?.developerWillBeBuildingsConstructor === undefined) {
    return undefined;
  }

  return getFutureOperator(
    {
      developerWillBeBuildingsConstructor:
        buildingsDeveloperAnswers.developerWillBeBuildingsConstructor,
      buildingsResalePlannedAfterDevelopment:
        buildingsDeveloperAnswers.buildingsResalePlannedAfterDevelopment,
    },
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
      ?.projectDeveloper,
  );
}
