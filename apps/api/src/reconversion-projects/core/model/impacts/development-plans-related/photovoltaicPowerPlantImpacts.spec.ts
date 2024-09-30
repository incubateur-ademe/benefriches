import { CO2eqMonetaryValueServiceMock } from "src/reconversion-projects/core/gateways/CO2eqMonetaryValueService.mock";

import { getPhotovoltaicProjectSpecificImpacts } from "./photovoltaicPowerPlantImpacts";

describe("Photovoltaic power plant specific impacts", () => {
  describe("Avoided CO2 eq emissions with EnR production", () => {
    it("returns householdsPoweredByRenewableEnergy, avoidedCO2TonsWithEnergyProduction and socioEconomic avoidedCO2TonsWithEnergyProduction", () => {
      const result = getPhotovoltaicProjectSpecificImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        expectedAnnualProduction: 4679,
      });

      expect(result).toMatchObject({
        socioeconomic: [
          {
            amount: expect.any(Number) as number,
            impact: "avoided_co2_eq_with_enr",
            impactCategory: "environmental_monetary",
            actor: "human_society",
          },
        ],
        avoidedCO2TonsWithEnergyProduction: { current: 0, forecast: expect.any(Number) as number },
        householdsPoweredByRenewableEnergy: { current: 0, forecast: expect.any(Number) as number },
      });
    });

    it("returns no impacts if there is no value for expectedAnnualProduction", () => {
      const cO2eqMonetaryValueService = new CO2eqMonetaryValueServiceMock();

      const spy = jest.spyOn(cO2eqMonetaryValueService, "getAnnualizedCO2MonetaryValueForDuration");
      const result = getPhotovoltaicProjectSpecificImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(spy).not.toHaveBeenCalled();

      const expected = {
        socioeconomic: [],
      };
      expect(result).toMatchObject(expected);
    });
  });
});
