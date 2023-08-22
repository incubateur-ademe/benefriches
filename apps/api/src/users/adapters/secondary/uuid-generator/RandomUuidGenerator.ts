import { v4 as uuid } from "uuid";
import { UuidGenerator } from "src/users/domain/gateways/UuidGenerator";

export class RandomUiidGenerator implements UuidGenerator {
  generate(): string {
    return uuid();
  }
}
