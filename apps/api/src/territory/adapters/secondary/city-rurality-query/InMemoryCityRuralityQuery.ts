import { CityRuralityQuery } from "src/territory/core/gateways/CityRuralityQuery";

export class InMemoryCityRuralityQuery implements CityRuralityQuery {
  private ruralCityCodes = new Set<string>();

  _setRuralCityCodes(cityCodes: string[]): void {
    this.ruralCityCodes = new Set(cityCodes);
  }

  isCityRural(cityCode: string): Promise<boolean> {
    return Promise.resolve(this.ruralCityCodes.has(cityCode));
  }
}
