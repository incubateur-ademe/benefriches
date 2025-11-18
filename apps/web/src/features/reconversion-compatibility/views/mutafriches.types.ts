import { MutabilityUsage } from "shared";

type EvaluationResults = {
  evaluationId: string;
  fiabilite: {
    note: number;
    text: string;
  };
  top3Usages: {
    usage: MutabilityUsage;
    indiceMutabilite: number;
    rang: number;
  }[];
};

export type MutafrichesEvaluationEvent =
  | {
      type: "mutafriches:completed";
      data: EvaluationResults;
    }
  | { type: "unknown"; data: unknown };
