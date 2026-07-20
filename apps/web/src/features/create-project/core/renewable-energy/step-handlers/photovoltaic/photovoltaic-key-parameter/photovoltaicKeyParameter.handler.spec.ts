import { KeyParameterHandler } from "./photovoltaicKeyParameter.handler";

// Pure-function navigation tests. They depend only on the handler contract
// (getNextStepId(params, answers) -> stepId), not on the store's internal step
// representation, so they survive the wizard-engine extraction.
describe("KeyParameterHandler", () => {
  describe("getNextStepId", () => {
    it("navigates to the power step when the key parameter is POWER", () => {
      const nextStep = KeyParameterHandler.getNextStepId(
        { context: { siteData: undefined }, answers: {} },
        { photovoltaicKeyParameter: "POWER" },
      );

      expect(nextStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    });

    it("navigates to the surface step when the key parameter is SURFACE", () => {
      const nextStep = KeyParameterHandler.getNextStepId(
        { context: { siteData: undefined }, answers: {} },
        { photovoltaicKeyParameter: "SURFACE" },
      );

      expect(nextStep).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    });
  });
});
