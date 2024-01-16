import { IDateProvider } from "./IDateProvider";

export class DeterministicDateProvider implements IDateProvider {
  constructor(private readonly fakeNow: Date) {}

  now(): Date {
    return this.fakeNow;
  }
}
