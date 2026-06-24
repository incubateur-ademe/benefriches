import { UidGenerator } from "./UidGenerator";

export class DeterministicUuidGenerator implements UidGenerator {
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
