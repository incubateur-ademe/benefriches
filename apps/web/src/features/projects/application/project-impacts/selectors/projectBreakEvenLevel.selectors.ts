import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto } from "shared";

import { RootState } from "@/app/store/store";

import { cropImpactsByEvaluationPeriod } from "../../../domain/cropImpactsByEvaluationPeriod";
import {
  groupIndirectEconomicImpactsByBearer,
  IndirectEconomicImpactsByBearer,
} from "../../../domain/groupIndirectImpactsByBearer";

const selectSelf = (state: RootState) => state.projectImpacts;

export const selectImpactsCroppedByEvaluationPeriod = createSelector([selectSelf], (state) =>
  state.impacts
    ? cropImpactsByEvaluationPeriod(state.impacts, state.evaluationPeriod ?? 50)
    : undefined,
);

const EMPTY_BEARER_STATE: IndirectEconomicImpactsByBearer = {
  local_authority: { total: 0, details: [] },
  local_people_or_company: { total: 0, details: [] },
  humanity: { total: 0, details: [] },
};
export const selectIndirectEconomicImpactsByBearer = createSelector(
  selectImpactsCroppedByEvaluationPeriod,
  (impacts): IndirectEconomicImpactsByBearer => {
    if (!impacts) {
      return EMPTY_BEARER_STATE;
    }
    return groupIndirectEconomicImpactsByBearer(
      impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
      impacts.stakeholders,
    );
  },
);

export type BreakEvenLevelTabDataView =
  | (GetReconversionProjectImpactsResultDto["impacts"] & {
      indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearer;
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
