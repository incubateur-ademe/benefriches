import { GetCarbonStorageFromSoilDistributionService } from "./SoilsCarbonStorageService";

export class FakeGetSoilsCarbonStorageService
  implements GetCarbonStorageFromSoilDistributionService
{
  result: number | null = null;
  _isShouldFailOnExecute = false;

  _setResult(result: number) {
    this.result = result;
  }

  shouldFailOnExecute() {
    this._isShouldFailOnExecute = true;
  }

  execute(): Promise<number | undefined> {
    if (this._isShouldFailOnExecute) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(this.result ?? 20);
  }
}
