import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import { EvaluationCompletedPayload } from "../../core/actions/compatibilityEvaluationCompleted.actions";
import { ReconversionCompatibilityEvaluationResults } from "../../core/actions/compatibilityEvaluationResultsRequested.actions";
import { ReconversionCompatibilityEvaluationGateway } from "../../core/actions/reconversionCompatibilityEvaluationGateway";
import { MutabilityUsage } from "../../core/reconversionCompatibilityEvaluation.reducer";

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

export class HttpReconversionCompatibilityEvaluation
  implements ReconversionCompatibilityEvaluationGateway
{
  async startEvaluation(input: { evaluationId: string }): Promise<void> {
    await fetch("/api/reconversion-compatibility/start-evaluation", {
      method: "POST",
      body: JSON.stringify({ id: input.evaluationId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async completeEvaluation(payload: EvaluationCompletedPayload): Promise<void> {
    await fetch("/api/reconversion-compatibility/complete-evaluation", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getEvaluationResults(
    mutafrichesId: string,
  ): Promise<ReconversionCompatibilityEvaluationResults | null> {
    const response = await fetch(
      `${BENEFRICHES_ENV.mutafrichesUrl}/friches/evaluations/${mutafrichesId}`,
    );
    if (!response.ok) return null;

    const json = (await response.json()) as MutafrichesEvaluationResultResponse;

    return {
      mutafrichesId: json.id,
      reliabilityScore: json.mutabilite.fiabilite.note,
      top3Usages: json.mutabilite.resultats
        .toSorted((a, b) => a.rang - b.rang)
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
