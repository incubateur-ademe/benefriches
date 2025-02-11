import { CityCodeService } from "src/reconversion-projects/core/gateways/CityCodeService";
import { City } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

type Props =
  | {
      shouldFail: true;
      successResult?: never;
    }
  | {
      shouldFail: false;
      successResult: City;
    };

export class FakeCityCodeService implements CityCodeService {
  shouldFail: boolean;
  successResult: City | undefined;

  constructor({ shouldFail, successResult }: Props) {
    this.shouldFail = shouldFail;

    if (!shouldFail) this.successResult = successResult;
  }

  async getCityByCityCode(cityCode: string): Promise<City> {
    if (this.shouldFail || !this.successResult) {
      throw new Error(`City with city code ${cityCode} was not found`);
    }

    return Promise.resolve(this.successResult);
  }
}
