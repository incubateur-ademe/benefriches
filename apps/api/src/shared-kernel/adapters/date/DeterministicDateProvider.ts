import { DateProvider } from "../../dateProvider";

export class DeterministicDateProvider implements DateProvider {
  private readonly fakeNow: Date;
  constructor(fakeNow: Date) {
    this.fakeNow = fakeNow;
  }

  now(): Date {
    return this.fakeNow;
  }
}
