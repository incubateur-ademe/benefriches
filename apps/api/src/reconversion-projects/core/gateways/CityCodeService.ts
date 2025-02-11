import { City } from "../usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

export interface CityCodeService {
  getCityByCityCode(cityCode: string): Promise<City>;
}
