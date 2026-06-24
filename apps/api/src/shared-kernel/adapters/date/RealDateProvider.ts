import { DateProvider } from "./IDateProvider";

export class RealDateProvider implements DateProvider {
  now(): Date {
    return new Date();
  }
}
