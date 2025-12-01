import {
  MutabilityEvaluationQuery,
  MutabilityEvaluationResult,
} from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";

const defaultData: MutabilityEvaluationResult = {
  mutafrichesId: "any-id",
  reliabilityScore: 7,
  usages: [
    {
      usage: "equipements",
      score: 0.7,
      rank: 1,
    },
    {
      usage: "culture",
      score: 0.65,
      rank: 2,
    },
    {
      usage: "residentiel",
      score: 0.5,
      rank: 3,
    },
    {
      usage: "renaturation",
      score: 0.4,
      rank: 4,
    },
  ],
};

export class InMemoryMutabilityEvaluationQuery implements MutabilityEvaluationQuery {
  evaluationResponses: Map<string, MutabilityEvaluationResult> = new Map();

  setResponseForId(mutafrichesId: string, response: MutabilityEvaluationResult) {
    this.evaluationResponses.set(mutafrichesId, response);
  }

  withDefaultDataForId(mutafrichesId: string) {
    this.evaluationResponses.set(mutafrichesId, { ...defaultData, mutafrichesId });
  }

  getEvaluation(id: string): Promise<MutabilityEvaluationResult> {
    const response = this.evaluationResponses.get(id);
    if (!response) {
      throw new Error(`No in-memory mutability evaluation found for id ${id}`);
    }

    return Promise.resolve(response);
  }
}
