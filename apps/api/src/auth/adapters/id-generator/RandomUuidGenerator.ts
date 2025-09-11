import { v4 as uuid } from "uuid";

import { UuidGenerator } from "src/auth/core/gateways/IdGenerator";

export class RandomUuidGenerator implements UuidGenerator {
  generate(): string {
    return uuid();
  }
}
