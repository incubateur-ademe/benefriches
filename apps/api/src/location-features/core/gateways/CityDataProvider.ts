import { Observable } from "rxjs";
import { City } from "../models/city";

export interface CityDataProvider {
  getCitySurfaceAreaAndPopulation(cityCode: string): Observable<City>;
}
