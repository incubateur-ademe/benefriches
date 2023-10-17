import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Observable } from "rxjs";
import { TownDataProvider } from "src/location-features/domain/gateways/TownDataProvider";
import { Town } from "src/location-features/domain/models/town";

const SAMPLES = [
  {
    area: 118.3,
    population: 471941,
    cityCode: "54321",
  },
  {
    cityCode: "01039",
    population: undefined,
    area: undefined,
  },
  {
    cityCode: "38375",
    population: 106,
    area: 123.5,
  },
  {
    cityCode: "75056",
    population: 2145906,
    area: 10540,
  },
];

export class MockLocalDataInseeService implements TownDataProvider {
  getTownAreaAndPopulation(cityCode: string): Observable<Town> {
    return new Observable((subscriber) => {
      if (cityCode.length === 0) {
        throw new BadRequestException();
      }
      const result = SAMPLES.find((sample) => sample.cityCode === cityCode);

      if (!result) {
        throw new NotFoundException();
      }

      if (!result.population || !result.area) {
        throw new NotFoundException("No data found for cityCode " + cityCode);
      }

      subscriber.next(Town.create(result));
      subscriber.complete();
    });
  }
}
