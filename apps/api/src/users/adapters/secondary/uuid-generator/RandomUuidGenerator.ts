import { v4 as uuid } from "uuid";
import { UuidGenerator } from "src/users/domain/gateways/UuidGenerator";

export class RandomUuidGenerator implements UuidGenerator {
  generate(): string {
    return uuid();
  }
}
