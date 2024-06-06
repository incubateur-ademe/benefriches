import { Observable } from "rxjs";
import { Town } from "../models/town";

export interface TownDataProvider {
  getTownAreaAndPopulation(cityCode: string): Observable<Town>;
}
