import { describe, expect, it } from "vitest";

import { getProjectSummary } from "./projectSummary";

const DEVELOPER = { name: "La SPL", structureType: "company" as const };

function makeSteps(
  overrides: Partial<Parameters<typeof getProjectSummary>[0]> = {},
): Parameters<typeof getProjectSummary>[0] {
  return {
    URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
      completed: true,
      payload: { projectDeveloper: DEVELOPER },
    },
    ...overrides,
  } as Parameters<typeof getProjectSummary>[0];
}

describe("getProjectSummary - buildingsContractorName", () => {
  it("returns developer name when developerWillBeBuildingsConstructor is true", () => {
    const steps = makeSteps({
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: { developerWillBeBuildingsConstructor: true },
      },
    });

    const result = getProjectSummary(steps, [
      "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
    ] as Parameters<typeof getProjectSummary>[1]);

    expect(result.buildingsContractorName).toEqual({
      value: "La SPL",
      shouldDisplay: true,
    });
  });

  it("returns undefined name when developerWillBeBuildingsConstructor is false (no separate contractor stored)", () => {
    const steps = makeSteps({
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: { developerWillBeBuildingsConstructor: false },
      },
    });

    const result = getProjectSummary(steps, [
      "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
    ] as Parameters<typeof getProjectSummary>[1]);

    expect(result.buildingsContractorName).toEqual({
      value: undefined,
      shouldDisplay: true,
    });
  });

  it("returns shouldDisplay false when URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER is not in steps sequence", () => {
    const steps = makeSteps({});

    const result = getProjectSummary(
      steps,
      [] as unknown as Parameters<typeof getProjectSummary>[1],
    );

    expect(result.buildingsContractorName).toEqual({
      value: undefined,
      shouldDisplay: false,
    });
  });
});
