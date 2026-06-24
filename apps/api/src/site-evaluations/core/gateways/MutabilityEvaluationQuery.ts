import { MutabilityUsage } from "shared";

export type MutabilityEvaluationResult = {
  mutafrichesId: string;
  reliabilityScore: number;
  usages: {
    usage: MutabilityUsage;
    score: number;
    rank: number;
  }[];
};

export interface MutabilityEvaluationQuery {
  getEvaluation(evaluationId: string): Promise<MutabilityEvaluationResult | null>;
}
