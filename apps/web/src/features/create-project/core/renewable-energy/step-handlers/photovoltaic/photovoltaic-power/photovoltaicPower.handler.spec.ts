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
});
