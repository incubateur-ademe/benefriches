import { DateProvider } from "./IDateProvider";

export class DeterministicDateProvider implements DateProvider {
  constructor(private readonly fakeNow: Date) {}

  now(): Date {
    return this.fakeNow;
  }
}
