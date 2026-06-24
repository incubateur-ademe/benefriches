import { success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { CityRuralityQuery } from "../gateways/CityRuralityQuery";

type Request = {
  cityCode: string;
};

type Response = {
  cityCode: string;
  isRural: boolean;
};

export class GetCityRuralityUseCase implements UseCase<Request, TResult<Response>> {
  constructor(private readonly cityRuralityQuery: CityRuralityQuery) {}

  async execute({ cityCode }: Request): Promise<TResult<Response>> {
    const isRural = await this.cityRuralityQuery.isCityRural(cityCode);

    return success({ cityCode, isRural });
  }
}
