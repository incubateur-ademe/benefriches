import { MutabilityUsage } from "../core/fricheMutability.reducer";

export type MutafrichesEvaluationResults = {
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
      data: MutafrichesEvaluationResults;
    }
  | { type: "unknown"; data: unknown };
