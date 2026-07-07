import { DateProvider } from "./IDateProvider";

export class DeterministicDateProvider implements DateProvider {
  private readonly fakeNow: Date;
  constructor(fakeNow: Date) {
    this.fakeNow = fakeNow;
  }

  now(): Date {
    return this.fakeNow;
  }
}
