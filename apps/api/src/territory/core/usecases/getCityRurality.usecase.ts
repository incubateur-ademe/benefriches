import { success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { CityRuralityQuery } from "../gateways/CityRuralityQuery";

type Request = {
  cityCode: string;
};

type Response = {
  cityCode: string;
  isRural: boolean;
};

export class GetCityRuralityUseCase implements UseCase<Request, TResult<Response>> {
  private readonly cityRuralityQuery: CityRuralityQuery;
  constructor(cityRuralityQuery: CityRuralityQuery) {
    this.cityRuralityQuery = cityRuralityQuery;
  }

  async execute({ cityCode }: Request): Promise<TResult<Response>> {
    const isRural = await this.cityRuralityQuery.isCityRural(cityCode);

    return success({ cityCode, isRural });
  }
}
