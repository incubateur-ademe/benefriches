import { describe, it } from "vitest";

describe("Urban project buildings sequencing - new construction only with demolition", () => {
  it.todo(
    "should navigate forward: uses floor surface area -> reuse introduction -> footprint to reuse -> demolition info -> new-construction info",
  );
  it.todo(
    "should navigate backward: new-construction info -> demolition info -> footprint to reuse -> reuse introduction",
  );
  it.todo(
    "should navigate forward: new-construction info (reuse = 0, new > 0) -> site resale introduction",
  );
  it.todo(
    "should navigate forward: new-construction info (reuse = 0, new > 0, contaminated soils) -> soils decontamination introduction",
  );
});
