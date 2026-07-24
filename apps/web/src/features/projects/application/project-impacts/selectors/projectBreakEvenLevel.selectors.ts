import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto } from "shared";

import { RootState } from "@/app/store/store";

import { cropImpactsByEvaluationPeriod } from "../../../core/cropImpactsByEvaluationPeriod";
import {
  groupIndirectEconomicImpactsByBearerAndCategory,
  IndirectEconomicImpactsByBearerAndGroupCategory,
} from "../../../core/groupIndirectImpactsByBearer";

const selectSelf = (state: RootState) => state.projectImpacts;
const selectContextData = (state: RootState) => state.projectImpacts.contextData;

export const selectImpactsCroppedByEvaluationPeriod = createSelector([selectSelf], (state) =>
  state.impacts
    ? cropImpactsByEvaluationPeriod(state.impacts, state.evaluationPeriod ?? 50)
    : undefined,
);

export const selectIndirectEconomicImpactsByBearerAndCategory = createSelector(
  selectImpactsCroppedByEvaluationPeriod,
  (impacts): IndirectEconomicImpactsByBearerAndGroupCategory =>
    groupIndirectEconomicImpactsByBearerAndCategory({
      indirectEconomicImpacts:
        impacts?.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
      indirectEconomicImpactsTotal:
        impacts?.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
      stakeholders: impacts?.stakeholders,
    }),
);

export type BreakEvenLevelTabDataView =
  | {
      indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearerAndGroupCategory;
      impacts: GetReconversionProjectImpactsResultDto["impacts"];
      contextData: GetReconversionProjectImpactsResultDto["contextData"];
    }
  | undefined;
export const selectBreakEvenLevelTabDataView = createSelector(
  [
    selectImpactsCroppedByEvaluationPeriod,
    selectIndirectEconomicImpactsByBearerAndCategory,
    selectContextData,
  ],
  (
    impactsForEvaluationPeriod,
    indirectEconomicImpactsByBearer,
    contextData,
  ): BreakEvenLevelTabDataView => {
    if (!impactsForEvaluationPeriod || !contextData) {
      return undefined;
    }
    return {
      impacts: impactsForEvaluationPeriod,
      indirectEconomicImpactsByBearer,
      contextData,
    };
  },
);
