import { PhotovoltaicPowerStationFeatures } from "../../reconversionProject";
import { UrbanProjectFeatures } from "../../urbanProjects";
import { FullTimeJobsImpactService } from "./fullTimeJobsImpactService";

type Case =
  | {
      type: "PHOTOVOLTAIC_POWER_PLANT";
      features: Pick<PhotovoltaicPowerStationFeatures, "electricalPowerKWc">;
    }
  | {
      type: "URBAN_PROJECT";
      features: Pick<UrbanProjectFeatures, "buildingsFloorAreaDistribution">;
    };
const CASES: Case[] = [
  { type: "PHOTOVOLTAIC_POWER_PLANT", features: { electricalPowerKWc: 10000 } },
  {
    type: "URBAN_PROJECT",
    features: {
      buildingsFloorAreaDistribution: { RESIDENTIAL: 10000, GROUND_FLOOR_RETAIL: 20000 },
    },
  },
];

describe("FullTimeJobsImpactService impact", () => {
  describe.each(CASES)("for project $type", (developmentPlan) => {
    it("returns impact over 10 years for full-time jobs in operations and full-time jobs for conversion over 9 months", () => {
      const props = {
        conversionSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-09-31"),
        },
        evaluationPeriodInYears: 10,
        developmentPlan,
        reinstatementExpenses: [],
      };
      const service = new FullTimeJobsImpactService(props);
      const expected =
        developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? {
              conversion: 1,
              operation: 2,
            }
          : {
              conversion: 0,
              operation: 880,
            };
      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: 0,
        forecast: expected.operation + expected.conversion,
        operations: {
          current: 0,
          forecast: expected.operation,
        },
        conversion: {
          current: 0,
          forecast: expected.conversion,
        },
      });
    });

    it("returns impact with values = 0 if no schedules are provided", () => {
      const service = new FullTimeJobsImpactService({
        developmentPlan,
        reinstatementExpenses: [
          { amount: 2250000, purpose: "asbestos_removal" },
          { purpose: "remediation", amount: 3300000 },
          { purpose: "demolition", amount: 2250000 },
          { purpose: "deimpermeabilization", amount: 498000 },
          { purpose: "sustainable_soils_reinstatement", amount: 2520000 },
        ],
        evaluationPeriodInYears: 20,
      });

      const expectedOperationsJobs = developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? 2 : 880;

      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: 0,
        forecast: expectedOperationsJobs,
        operations: {
          current: 0,
          forecast: expectedOperationsJobs,
        },
        conversion: {
          current: 0,
          forecast: 0,
        },
      });
    });

    it("returns impact computed from default values with schedules", () => {
      const service = new FullTimeJobsImpactService({
        developmentPlan,
        reinstatementExpenses: [
          { amount: 2250000, purpose: "asbestos_removal" },
          { purpose: "remediation", amount: 3300000 },
          { purpose: "demolition", amount: 2250000 },
          { purpose: "deimpermeabilization", amount: 498000 },
          { purpose: "sustainable_soils_reinstatement", amount: 2520000 },
        ],
        evaluationPeriodInYears: 20,
        conversionSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2025-01-01"),
        },
        reinstatementSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-06-30"),
        },
      });

      const expected =
        developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? {
              reinstatement: 2,
              conversion: 0.7,
              operation: 2,
            }
          : {
              reinstatement: 2,
              conversion: 0,
              operation: 880,
            };
      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: 0,
        forecast: expected.reinstatement + expected.conversion + expected.operation,
        operations: {
          current: 0,
          forecast: expected.operation,
        },
        conversion: {
          current: 0,
          forecast: expected.conversion + expected.reinstatement,
        },
      });
    });
  });
});
