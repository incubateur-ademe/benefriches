import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { MutabilityUsage } from "shared";

import {
  MutabilityEvaluationQuery,
  MutabilityEvaluationResult,
} from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";

type MutafrichesEvaluationResultResponse = {
  id: string;
  mutabilite: {
    fiabilite: { note: number };
    resultats: { rang: number; usage: MutabilityUsage; indiceMutabilite: number }[];
  };
};
@Injectable()
export class MutafrichesEvaluationQuery implements MutabilityEvaluationQuery {
  constructor(private readonly httpService: HttpService) {}

  getEvaluation(mutafrichesId: string): Promise<MutabilityEvaluationResult | null> {
    return lastValueFrom(
      this.httpService
        .get(`${process.env.MUTAFRICHES_API_URL}/friches/evaluations/${mutafrichesId}`)
        .pipe(
          map(({ data: result }: { data: MutafrichesEvaluationResultResponse }) => {
            return {
              mutafrichesId: result.id,
              reliabilityScore: result.mutabilite.fiabilite.note,
              usages: result.mutabilite.resultats
                .toSorted((a, b) => a.rang - b.rang)
                .map((usage) => ({
                  usage: usage.usage,
                  score: usage.indiceMutabilite,
                  rank: usage.rang,
                })),
            };
          }),
        )
        .pipe(
          catchError((axiosError: AxiosError) => {
            const err = new Error(`Error response from Mutafriches API: ${axiosError.message}`);
            if (axiosError.response?.data) {
              err.message.concat(` - ${axiosError.response.data as string}`);
            }
            throw err;
          }),
        ),
    );
  }
}
