import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import {
  willConstructNewBuildings,
  willReuseExistingBuildings,
} from "../../buildings/buildingsReaders";

type ExpensesBuildingsConstructionAndRehabilitationViewData = {
  technicalStudiesAndFees: number | undefined;
  buildingsConstructionWorks: number | undefined;
  buildingsRehabilitationWorks: number | undefined;
  otherConstructionExpenses: number | undefined;
  hasConstruction: boolean;
  hasRehabilitation: boolean;
};

export const createSelectExpensesBuildingsConstructionAndRehabilitationViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): ExpensesBuildingsConstructionAndRehabilitationViewData => {
      const currentAnswers = ReadStateHelper.getStepAnswers(
        stepsState,
        "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
      );
      const hasConstruction = willConstructNewBuildings(stepsState);
      const hasRehabilitation = willReuseExistingBuildings(stepsState);

      return {
        technicalStudiesAndFees: currentAnswers?.technicalStudiesAndFees,
        buildingsConstructionWorks: hasConstruction
          ? currentAnswers?.buildingsConstructionWorks
          : undefined,
        buildingsRehabilitationWorks: hasRehabilitation
          ? currentAnswers?.buildingsRehabilitationWorks
          : undefined,
        otherConstructionExpenses: currentAnswers?.otherConstructionExpenses,
        hasConstruction,
        hasRehabilitation,
      };
    },
  );
