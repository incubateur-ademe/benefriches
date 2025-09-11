import { UuidGenerator } from "src/auth/core/gateways/IdGenerator";

export class DeterministicUuidGenerator implements UuidGenerator {
  private _nextUuids: string[] = [];

  generate(): string {
    const uuid = this._nextUuids.pop();

    if (!uuid) {
      throw new Error("No more UUIDs, please provide more using nextUuids()");
    }
    return uuid;
  }

  nextUuids(...uuids: string[]) {
    this._nextUuids = uuids;
  }
}
