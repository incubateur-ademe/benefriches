import { IDateProvider } from "./IDateProvider";

export class DateProvider implements IDateProvider {
  now(): Date {
    return new Date();
  }
}
