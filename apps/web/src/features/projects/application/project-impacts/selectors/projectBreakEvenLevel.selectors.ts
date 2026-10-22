import { createSelector } from "@reduxjs/toolkit";
import type { GetReconversionProjectImpactsResultDto } from "shared";

import type { EconomicBalanceByCategory } from "@/features/projects/core/projectImpactsEconomicBalance";

import type { IndirectEconomicImpactsByBearerAndGroupCategory } from "../../../core/groupIndirectImpactsByBearer";
import { groupIndirectEconomicImpactsByBearerAndCategory } from "../../../core/groupIndirectImpactsByBearer";
import {
  type ModalDataProps,
  selectEconomicBalanceProjectImpacts,
  selectImpactsCroppedByEvaluationPeriod,
  selectImpactsDescriptionModalsDataView,
} from "./projectImpacts.selectors";

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
      modalsProps: ModalDataProps;
    }
  | undefined;

export const selectBreakEvenLevelTabDataView = createSelector(
  [
    selectImpactsCroppedByEvaluationPeriod,
    selectEconomicBalanceProjectImpacts,
    selectIndirectEconomicImpactsByBearerAndCategory,
    selectImpactsDescriptionModalsDataView,
  ],
  (
    impactsForEvaluationPeriod,
    projectEconomicBalanceByCategory,
    indirectEconomicImpactsByBearer,
    modalsProps,
  ): BreakEvenLevelTabDataView => {
    if (!impactsForEvaluationPeriod || !modalsProps) {
      return undefined;
    }
    return {
      impacts: impactsForEvaluationPeriod,
      projectEconomicBalanceByCategory,
      indirectEconomicImpactsByBearer,
      modalsProps,
    };
  },
);
