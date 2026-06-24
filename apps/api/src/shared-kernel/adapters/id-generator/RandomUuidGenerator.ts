import { v4 as uuid } from "uuid";

import type { UidGenerator } from "./UidGenerator";

export class RandomUuidGenerator implements UidGenerator {
  generate(): string {
    return uuid();
  }
}
