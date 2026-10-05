import { describe, expect, it } from "vitest";

import { inferDecontaminationPlan } from "./soilsDecontamination";

describe("inferDecontaminationPlan", () => {
  // 2000 m2 of contaminated soils: the 25% default is 500 m2.
  const contaminatedSoilSurface = 2000;

  it("infers 'none' when the saved decontaminated surface is 0", () => {
    expect(inferDecontaminationPlan(0, contaminatedSoilSurface)).toBe("none");
  });

  it("infers 'unknown' when the saved decontaminated surface equals the 25% default", () => {
    expect(inferDecontaminationPlan(500, contaminatedSoilSurface)).toBe("unknown");
  });

  it("infers 'partial' when the saved decontaminated surface is another value", () => {
    expect(inferDecontaminationPlan(1200, contaminatedSoilSurface)).toBe("partial");
  });
});
