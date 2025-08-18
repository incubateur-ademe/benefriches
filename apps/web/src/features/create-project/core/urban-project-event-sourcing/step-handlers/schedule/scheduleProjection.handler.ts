import { getDefaultScheduleForProject } from "shared";

import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class UrbanProjectScheduleProjectionHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_SCHEDULE_PROJECTION";

  handleUpdateSideEffects(): void {}

  setDefaultAnswers(context: StepContext): void {
    const { installation, reinstatement, firstYearOfOperations } = getDefaultScheduleForProject({
      now: () => new Date(),
    })({
      hasReinstatement: context.siteData?.nature === "FRICHE",
    });

    this.updateAnswers(
      context,
      {
        reinstatementSchedule: reinstatement
          ? {
              startDate: reinstatement.startDate.toDateString(),
              endDate: reinstatement.endDate.toDateString(),
            }
          : undefined,
        installationSchedule: {
          startDate: installation.startDate.toDateString(),
          endDate: installation.endDate.toDateString(),
        },
        firstYearOfOperation: firstYearOfOperations,
      },
      "system",
    );
  }

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SCHEDULE_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_PROJECT_PHASE");
  }
}
