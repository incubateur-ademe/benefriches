import { v4 as uuid } from "uuid";
import { UuidGenerator } from "../../core/gateways/UuidGenerator";

export class RandomUiidGenerator implements UuidGenerator {
  generate(): string {
    return uuid();
  }
}
