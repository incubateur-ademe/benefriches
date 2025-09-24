import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import {
  MutabilityEvaluationResults,
  FricheMutabilityEvaluationGateway,
} from "../../core/fricheMutability.actions";
import { MutabilityUsage } from "../../core/fricheMutability.reducer";

export type MutafrichesEvaluationResultResponse = {
  id: string;
  identifiantParcelle: string;
  enrichissement: {
    commune: string;
    codeInsee: string;
    coordonnees: {
      latitude: number;
      longitude: number;
    };
    surfaceBati: number;
    surfaceSite: number;
    identifiantParcelle: string;
  };
  mutabilite: {
    fiabilite: { note: number };
    resultats: { rang: number; usage: MutabilityUsage; indiceMutabilite: number }[];
  };
};

export class HttpFricheMutabilityEvaluation implements FricheMutabilityEvaluationGateway {
  async getEvaluationResults(evaluationId: string): Promise<MutabilityEvaluationResults | null> {
    const response = await fetch(
      `${BENEFRICHES_ENV.mutafrichesUrl}/friches/evaluations/${evaluationId}`,
    );
    if (!response.ok) return null;

    const json = (await response.json()) as MutafrichesEvaluationResultResponse;

    return {
      evaluationId: json.id,
      reliabilityScore: json.mutabilite.fiabilite.note,
      top3Usages: json.mutabilite.resultats
        .sort((a, b) => a.rang - b.rang)
        .slice(0, 3)
        .map((usage) => ({
          usage: usage.usage,
          score: usage.indiceMutabilite,
          rank: usage.rang,
        })),
      evaluationInput: {
        cadastreId: json.enrichissement.identifiantParcelle,
        city: json.enrichissement.commune,
        cityCode: json.enrichissement.codeInsee,
        surfaceArea: json.enrichissement.surfaceSite,
        buildingsFootprintSurfaceArea: json.enrichissement.surfaceBati,
      },
    };
  }
}
