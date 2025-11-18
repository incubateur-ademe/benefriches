import {
  MutabilityEvaluationQuery,
  MutabilityEvaluationResult,
} from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";

export class InMemoryMutabilityEvaluationQuery implements MutabilityEvaluationQuery {
  getEvaluation(id: string): Promise<MutabilityEvaluationResult> {
    return Promise.resolve({
      mutafrichesId: id,
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
    });
  }
}
