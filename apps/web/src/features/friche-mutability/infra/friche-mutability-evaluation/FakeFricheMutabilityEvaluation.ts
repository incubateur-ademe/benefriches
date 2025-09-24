import {
  MutabilityEvaluationResults,
  FricheMutabilityEvaluationGateway,
} from "../../core/fricheMutability.actions";
import { MutafrichesEvaluationResultResponse } from "./HttpFricheMutabilityEvaluation";

const fakeResponse = {
  id: "d507fbf9-1c22-473b-901a-3f1a169a1c02",
  identifiantParcelle: "50147000AR0010",
  enrichissement: {
    commune: "Coutances",
    codeInsee: "50147",
    coordonnees: {
      latitude: 49.0421992,
      longitude: -1.45017951,
    },
    surfaceBati: 1214,
    surfaceSite: 1782,
    identifiantParcelle: "50147000AR0010",
  },
  mutabilite: {
    fiabilite: {
      note: 6,
    },
    resultats: [
      {
        rang: 1,
        usage: "residentiel",
        indiceMutabilite: 86.8,
      },
      {
        rang: 2,
        usage: "equipements",
        indiceMutabilite: 72.9,
      },
      {
        rang: 3,
        usage: "tertiaire",
        indiceMutabilite: 68.2,
      },
      {
        rang: 4,
        usage: "culture",
        indiceMutabilite: 62.1,
      },
      {
        rang: 5,
        usage: "renaturation",
        indiceMutabilite: 50,
      },
      {
        rang: 6,
        usage: "industrie",
        indiceMutabilite: 37.5,
      },
      {
        rang: 7,
        usage: "photovoltaique",
        indiceMutabilite: 35,
      },
    ],
  },
} satisfies MutafrichesEvaluationResultResponse;

export class FakeFricheMutabilityEvaluation implements FricheMutabilityEvaluationGateway {
  async getEvaluationResults(): Promise<MutabilityEvaluationResults> {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return Promise.resolve({
      evaluationId: fakeResponse.id,
      reliabilityScore: fakeResponse.mutabilite.fiabilite.note,
      top3Usages: fakeResponse.mutabilite.resultats
        .sort((a, b) => a.rang - b.rang)
        .slice(0, 3)
        .map((usage) => ({
          usage: usage.usage,
          score: usage.indiceMutabilite,
          rank: usage.rang,
        })),
      evaluationInput: {
        cadastreId: fakeResponse.enrichissement.identifiantParcelle,
        city: fakeResponse.enrichissement.commune,
        cityCode: fakeResponse.enrichissement.codeInsee,
        surfaceArea: fakeResponse.enrichissement.surfaceSite,
        buildingsFootprintSurfaceArea: fakeResponse.enrichissement.surfaceBati,
      },
    });
  }
}
