import { describe, it } from "vitest";

describe("Urban project buildings sequencing - reuse only with demolition", () => {
  it.todo(
    "should navigate forward: uses floor surface area -> reuse introduction -> footprint to reuse -> demolition info",
  );
  it.todo("should navigate backward: demolition info -> footprint to reuse -> reuse introduction");
  it.todo(
    "should navigate forward: demolition info (reuse > 0, new = 0) -> site resale introduction",
  );
  it.todo(
    "should navigate forward: demolition info (reuse > 0, new = 0, contaminated soils) -> soils decontamination introduction",
  );
});
