import { IDateProvider } from "../../../adapters/IDateProvider";

export class DeterministicDateProvider implements IDateProvider {
  private readonly fakeNow: Date;

  constructor(fakeNow: Date) {
    this.fakeNow = fakeNow;
  }

  now(): Date {
    return this.fakeNow;
  }
}
