import { v4 as uuid } from "uuid";

import { UidGenerator } from "../../uidGenerator";

export class RandomUuidGenerator implements UidGenerator {
  generate(): string {
    return uuid();
  }
}
