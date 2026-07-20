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
});
