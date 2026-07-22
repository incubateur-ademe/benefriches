import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";

import type { AnswersByStep } from "../../../renewableEnergySteps";
import type {
  RenewableEnergyStepHandlerContext,
  RenewableEnergyStepsState,
} from "../../stepHandler.type";
import { SurfaceHandler } from "./photovoltaicSurface.handler";

const stepsStateWithKeyParameter = (
  keyParameter: "POWER" | "SURFACE",
): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
    completed: true,
    payload: { photovoltaicKeyParameter: keyParameter },
  },
});

const completedSurface = (surfaceSquareMeters: number): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
    completed: true,
    payload: { photovoltaicInstallationSurfaceSquareMeters: surfaceSquareMeters },
  },
});

// Completed twin (power) + production, so the invalidation rules have live targets to fire on.
const completedDependents = (): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
    completed: true,
    payload: { photovoltaicInstallationElectricalPowerKWc: 10000 },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
    completed: true,
    payload: { photovoltaicExpectedAnnualProduction: 5000 },
  },
});

const stepsStateWithKeyParameterAndSurface = (
  keyParameter: "POWER" | "SURFACE",
  surfaceSquareMeters: number,
): RenewableEnergyStepsState => ({
  ...stepsStateWithKeyParameter(keyParameter),
  ...completedDependents(),
  ...completedSurface(surfaceSquareMeters),
});

const newSurface = (
  surfaceSquareMeters: number,
): AnswersByStep["RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE"] => ({
  photovoltaicInstallationSurfaceSquareMeters: surfaceSquareMeters,
});

// Pure-function navigation tests for the surface step, mirror image of the power step:
// the two swap order depending on the chosen key parameter.
describe("SurfaceHandler", () => {
  describe("getNextStepId", () => {
    it("goes to the expected annual production step when the key parameter is POWER", () => {
      const nextStep = SurfaceHandler.getNextStepId({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("POWER"),
      });

      expect(nextStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION");
    });

    it("goes to the power step when the key parameter is SURFACE", () => {
      const nextStep = SurfaceHandler.getNextStepId({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("SURFACE"),
      });

      expect(nextStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    });
  });

  describe("getPreviousStepId", () => {
    it("goes back to the power step when the key parameter is POWER", () => {
      const previousStep = SurfaceHandler.getPreviousStepId!({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("POWER"),
      });

      expect(previousStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    });

    it("goes back to the key parameter step when the key parameter is SURFACE", () => {
      const previousStep = SurfaceHandler.getPreviousStepId!({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("SURFACE"),
      });

      expect(previousStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
    });
  });

  describe("getDependencyRules", () => {
    it("invalidates the power twin and the expected annual production when surface changes and surface is the key parameter", () => {
      const rules = SurfaceHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndSurface("SURFACE", 1000),
        },
        newSurface(2000),
      );

      expect(rules).toEqual([
        { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER", action: "invalidate" },
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
          action: "invalidate",
        },
      ]);
    });

    it("does not touch power or production when surface changes but power is the key parameter", () => {
      const rules = SurfaceHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndSurface("POWER", 1000),
        },
        newSurface(2000),
      );

      expect(rules).toEqual([]);
    });

    it("returns no rule when surface is re-entered unchanged (surface is the key parameter)", () => {
      const rules = SurfaceHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndSurface("SURFACE", 1000),
        },
        newSurface(1000),
      );

      expect(rules).toEqual([]);
    });

    it("returns no rule when surface is re-entered unchanged (power is the key parameter)", () => {
      const rules = SurfaceHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndSurface("POWER", 1000),
        },
        newSurface(1000),
      );

      expect(rules).toEqual([]);
    });

    it("emits no rule for a dependent step that is not yet completed (first-time surface completion)", () => {
      const rules = SurfaceHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          // Only key parameter + surface present: power and production not yet completed.
          answers: {
            ...stepsStateWithKeyParameter("SURFACE"),
            ...completedSurface(1000),
          },
        },
        newSurface(2000),
      );

      expect(rules).toEqual([]);
    });
  });
});

// relatedSiteData has 5000 m² MINERAL_SOIL + 10000 m² ARTIFICIAL_GRASS_OR_BUSHES_FILLED = 15000 m²
// of soils suitable for photovoltaic panels; BUILDINGS (3000) and FOREST_DECIDUOUS (12000) are not.
// So a panel surface <= 15000 m² can be accommodated (no non-suitable steps), > 15000 m² cannot.
const SUITABLE_SURFACE_AREA = 15000;

const contextWithSuitableArea: { context: RenewableEnergyStepHandlerContext } = {
  context: { siteData: relatedSiteData },
};

const nonSuitableSoilsSteps = (): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: {
    completed: true,
    payload: { nonSuitableSoilsToTransform: ["BUILDINGS"] },
  },
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: {
    completed: true,
    payload: { nonSuitableSoilsSurfaceAreaToTransform: { BUILDINGS: 3000 } },
  },
});

const projectSelectionStep = (
  soilsTransformationProject: AnswersByStep["RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"]["soilsTransformationProject"],
): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: {
    completed: true,
    payload: { soilsTransformationProject },
  },
});

const customSoilsSteps = (): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: {
    completed: true,
    payload: { futureSoilsSelection: ["PRAIRIE_GRASS"] },
  },
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION: {
    completed: true,
    payload: { soilsDistribution: { PRAIRIE_GRASS: 1000 } },
  },
});

// Editing surface while POWER is the key parameter (surface is not primary) so the power/production
// twin rules never fire — the returned rules are exactly the soils-transformation cascade.
describe("SurfaceHandler - soils-transformation cascade (surface is not the key parameter)", () => {
  const oldNonSuitableSurface = SUITABLE_SURFACE_AREA + 5000; // 20000, non-suitable

  it("deletes the non-suitable steps when the new surface makes the site able to accommodate the panels (custom)", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("custom"),
          ...customSoilsSteps(),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA - 5000), // 10000, now suitable
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE", action: "delete" },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        action: "invalidate",
      },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        action: "invalidate",
      },
    ]);
  });

  it("invalidates the non-suitable steps when the new surface still cannot be accommodated (custom)", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("custom"),
          ...customSoilsSteps(),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA + 10000), // 25000, still non-suitable
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE", action: "invalidate" },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        action: "invalidate",
      },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        action: "invalidate",
      },
    ]);
  });

  it("keeps PROJECT_SELECTION and invalidates the custom soils/allocation steps for a custom transformation", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("custom"),
          ...customSoilsSteps(),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA + 10000),
    );

    const stepIds = rules.map((rule) => rule.stepId);
    expect(stepIds).not.toContain("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");
    expect(stepIds).toContain("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION");
    expect(stepIds).toContain(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
  });

  it("invalidates PROJECT_SELECTION for a renaturation transformation", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("renaturation"),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA + 10000),
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION", action: "invalidate" },
    ]);
  });

  it("invalidates PROJECT_SELECTION for a preserveCurrentSoils transformation", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("preserveCurrentSoils"),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA + 10000),
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION", action: "invalidate" },
    ]);
  });

  it("emits no non-suitable rules when the site was already suitable (no non-suitable steps present)", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(SUITABLE_SURFACE_AREA - 5000), // 10000, was suitable
          ...projectSelectionStep("custom"),
          ...customSoilsSteps(),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA - 3000), // 12000, still suitable
    );

    expect(rules).toEqual([
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        action: "invalidate",
      },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        action: "invalidate",
      },
    ]);
  });

  it("fires no soils cascade when PROJECT_SELECTION has not been reached", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
        },
      },
      newSurface(SUITABLE_SURFACE_AREA + 10000),
    );

    expect(rules).toEqual([]);
  });

  it("fires no soils cascade when the surface value is unchanged", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("custom"),
          ...customSoilsSteps(),
        },
      },
      newSurface(oldNonSuitableSurface),
    );

    expect(rules).toEqual([]);
  });

  it("does not invalidate custom soils/allocation steps that are not completed", () => {
    const rules = SurfaceHandler.getDependencyRules!(
      {
        ...contextWithSuitableArea,
        answers: {
          ...stepsStateWithKeyParameter("POWER"),
          ...completedSurface(oldNonSuitableSurface),
          ...nonSuitableSoilsSteps(),
          ...projectSelectionStep("custom"),
          // custom soils selection + allocation not yet completed
        },
      },
      newSurface(SUITABLE_SURFACE_AREA + 10000),
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE", action: "invalidate" },
    ]);
  });
});
