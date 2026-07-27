import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto } from "shared";

import { RootState } from "@/app/store/store";
import { EconomicBalanceByCategory } from "@/features/projects/core/projectImpactsEconomicBalance";

import {
  groupIndirectEconomicImpactsByBearerAndCategory,
  IndirectEconomicImpactsByBearerAndGroupCategory,
} from "../../../core/groupIndirectImpactsByBearer";
import {
  selectEconomicBalanceProjectImpacts,
  selectImpactsCroppedByEvaluationPeriod,
} from "./projectImpacts.selectors";

const selectContextData = (state: RootState) => state.projectImpacts.contextData;

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
      projectEconomicBalanceByCategory: EconomicBalanceByCategory;
      impacts: GetReconversionProjectImpactsResultDto["impacts"];
      contextData: GetReconversionProjectImpactsResultDto["contextData"];
    }
  | undefined;
export const selectBreakEvenLevelTabDataView = createSelector(
  [
    selectImpactsCroppedByEvaluationPeriod,
    selectEconomicBalanceProjectImpacts,
    selectIndirectEconomicImpactsByBearerAndCategory,
    selectContextData,
  ],
  (
    impactsForEvaluationPeriod,
    projectEconomicBalanceByCategory,
    indirectEconomicImpactsByBearer,
    contextData,
  ): BreakEvenLevelTabDataView => {
    if (!impactsForEvaluationPeriod || !contextData) {
      return undefined;
    }
    return {
      impacts: impactsForEvaluationPeriod,
      projectEconomicBalanceByCategory,
      indirectEconomicImpactsByBearer,
      contextData,
    };
  },
);
