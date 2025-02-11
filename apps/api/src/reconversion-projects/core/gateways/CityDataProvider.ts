import { City } from "../usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

export interface CityDataProvider {
  getCitySurfaceAreaAndPopulation(cityCode: string): Promise<City>;
}
