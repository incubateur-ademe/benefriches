import type { AnswersByStep } from "../../../renewableEnergySteps";
import type { RenewableEnergyStepsState } from "../../stepHandler.type";
import { PowerHandler } from "./photovoltaicPower.handler";

const stepsStateWithKeyParameter = (
  keyParameter: "POWER" | "SURFACE",
): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
    completed: true,
    payload: { photovoltaicKeyParameter: keyParameter },
  },
});

const completedPower = (powerKWc: number): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
    completed: true,
    payload: { photovoltaicInstallationElectricalPowerKWc: powerKWc },
  },
});

// Completed twin (surface) + production, so the invalidation rules have live targets to fire on.
const completedDependents = (): RenewableEnergyStepsState => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
    completed: true,
    payload: { photovoltaicInstallationSurfaceSquareMeters: 1000 },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
    completed: true,
    payload: { photovoltaicExpectedAnnualProduction: 5000 },
  },
});

const stepsStateWithKeyParameterAndPower = (
  keyParameter: "POWER" | "SURFACE",
  powerKWc: number,
): RenewableEnergyStepsState => ({
  ...stepsStateWithKeyParameter(keyParameter),
  ...completedDependents(),
  ...completedPower(powerKWc),
});

const newPower = (powerKWc: number): AnswersByStep["RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"] => ({
  photovoltaicInstallationElectricalPowerKWc: powerKWc,
});

// Pure-function navigation tests: the power step sits before or after the surface step
// depending on which parameter the user chose to drive the installation.
describe("PowerHandler", () => {
  describe("getNextStepId", () => {
    it("goes to the surface step when the key parameter is POWER", () => {
      const nextStep = PowerHandler.getNextStepId({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("POWER"),
      });

      expect(nextStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    });

    it("goes to the expected annual production step when the key parameter is SURFACE", () => {
      const nextStep = PowerHandler.getNextStepId({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("SURFACE"),
      });

      expect(nextStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION");
    });
  });

  describe("getPreviousStepId", () => {
    it("goes back to the key parameter step when the key parameter is POWER", () => {
      const previousStep = PowerHandler.getPreviousStepId!({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("POWER"),
      });

      expect(previousStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
    });

    it("goes back to the surface step when the key parameter is SURFACE", () => {
      const previousStep = PowerHandler.getPreviousStepId!({
        context: { siteData: undefined },
        answers: stepsStateWithKeyParameter("SURFACE"),
      });

      expect(previousStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    });
  });

  describe("getDependencyRules", () => {
    it("invalidates the expected annual production when power changes and it is not the key parameter", () => {
      const rules = PowerHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndPower("SURFACE", 10000),
        },
        newPower(20000),
      );

      expect(rules).toEqual([
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
          action: "invalidate",
        },
      ]);
    });

    it("also invalidates the surface twin when power changes and power is the key parameter", () => {
      const rules = PowerHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndPower("POWER", 10000),
        },
        newPower(20000),
      );

      expect(rules).toEqual([
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
          action: "invalidate",
        },
        { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE", action: "invalidate" },
      ]);
    });

    it("returns no rule when power is re-entered unchanged (power is the key parameter)", () => {
      const rules = PowerHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndPower("POWER", 10000),
        },
        newPower(10000),
      );

      expect(rules).toEqual([]);
    });

    it("returns no rule when power is re-entered unchanged (surface is the key parameter)", () => {
      const rules = PowerHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          answers: stepsStateWithKeyParameterAndPower("SURFACE", 10000),
        },
        newPower(10000),
      );

      expect(rules).toEqual([]);
    });

    it("emits no rule for a dependent step that is not yet completed (first-time power completion)", () => {
      const rules = PowerHandler.getDependencyRules!(
        {
          context: { siteData: undefined },
          // Only key parameter + power present: surface and production not yet completed.
          answers: {
            ...stepsStateWithKeyParameter("POWER"),
            ...completedPower(10000),
          },
        },
        newPower(20000),
      );

      expect(rules).toEqual([]);
    });
  });
});
