import { UuidGenerator } from "../../domain/gateways/UuidGenerator";

export class DeterministicUiidGenerator implements UuidGenerator {
  constructor(private fakeUuid: string) {}

  generate() {
    return this.fakeUuid;
  }
}
