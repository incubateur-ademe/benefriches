import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto } from "shared";

import { RootState } from "@/app/store/store";

import { cropImpactsByEvaluationPeriod } from "../../../domain/cropImpactsByEvaluationPeriod";
import {
  groupIndirectEconomicImpactsByBearerAndCategory,
  IndirectEconomicImpactsByBearerAndGroupCategory,
} from "../../../domain/groupIndirectImpactsByBearer";

const selectSelf = (state: RootState) => state.projectImpacts;

export const selectImpactsCroppedByEvaluationPeriod = createSelector([selectSelf], (state) =>
  state.impacts
    ? cropImpactsByEvaluationPeriod(state.impacts, state.evaluationPeriod ?? 50)
    : undefined,
);

export const selectIndirectEconomicImpactsByBearer = createSelector(
  selectImpactsCroppedByEvaluationPeriod,
  (impacts): IndirectEconomicImpactsByBearerAndGroupCategory =>
    groupIndirectEconomicImpactsByBearerAndCategory(
      impacts?.aggregatedReconversionImpacts.indirectEconomicImpacts,
      impacts?.stakeholders,
    ),
);

export type BreakEvenLevelTabDataView =
  | (GetReconversionProjectImpactsResultDto["impacts"] & {
      indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearerAndGroupCategory;
    })
  | undefined;
export const selectBreakEvenLevelTabDataView = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectIndirectEconomicImpactsByBearer],
  (
    breakEvenLevelForEvaluationPeriod,
    indirectEconomicImpactsByBearer,
  ): BreakEvenLevelTabDataView => {
    if (!breakEvenLevelForEvaluationPeriod) {
      return undefined;
    }
    return {
      ...breakEvenLevelForEvaluationPeriod,
      indirectEconomicImpactsByBearer,
    };
  },
);
