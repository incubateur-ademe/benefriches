import { describe, it } from "vitest";

describe("Urban project buildings sequencing - reuse and new construction", () => {
  it.todo(
    "should navigate forward (no demolition): footprint to reuse -> existing buildings uses -> new-construction info -> new buildings uses",
  );
  it.todo(
    "should navigate forward (with demolition): footprint to reuse -> demolition info -> existing buildings uses -> new-construction info -> new buildings uses",
  );
  it.todo(
    "should navigate backward: new buildings uses -> new-construction info -> existing buildings uses -> footprint to reuse -> reuse introduction",
  );
  it.todo(
    "should navigate backward (with demolition): existing buildings uses -> demolition info -> footprint to reuse",
  );
  it.todo(
    "should navigate forward: new buildings uses (reuse > 0, new > 0) -> site resale introduction",
  );
  it.todo(
    "should navigate forward: new buildings uses (reuse > 0, new > 0, contaminated soils) -> soils decontamination introduction",
  );
});
