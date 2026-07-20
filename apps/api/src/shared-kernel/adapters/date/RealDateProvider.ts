import { DateProvider } from "../../dateProvider";

export class RealDateProvider implements DateProvider {
  now(): Date {
    return new Date();
  }
}
