import type { AnswersByStep } from "../../../renewableEnergySteps";
import type { RenewableEnergyStepsState } from "../../stepHandler.type";
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
