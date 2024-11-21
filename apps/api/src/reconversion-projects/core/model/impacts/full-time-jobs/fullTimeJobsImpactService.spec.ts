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
    it("returns 0 when no current and forecast full time jobs provided", () => {
      const service = new FullTimeJobsImpactService({
        developmentPlan,
        reinstatementExpenses: [],
        statuQuoOperationsFullTimeJobs: 0,
        reinstatementFullTimeJobs: 0,
        conversionFullTimeJobs: 0,
        projectOperationsFullTimeJobs: 0,
        evaluationPeriodInYears: 30,
      });
      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: 0,
        forecast: 0,
        operations: {
          current: 0,
          forecast: 0,
        },
        conversion: {
          current: 0,
          forecast: 0,
        },
      });
    });

    it("returns impact over 10 years for 0.5 current full-time jobs and forecast 0.3 full-time jobs in operations but no conversion jobs", () => {
      const props = {
        statuQuoOperationsFullTimeJobs: 0.5,
        projectOperationsFullTimeJobs: 0.3,
        evaluationPeriodInYears: 10,
        developmentPlan,
        reinstatementExpenses: [],
      };
      const service = new FullTimeJobsImpactService(props);
      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: props.statuQuoOperationsFullTimeJobs,
        forecast: props.projectOperationsFullTimeJobs,
        operations: {
          current: props.statuQuoOperationsFullTimeJobs,
          forecast: props.projectOperationsFullTimeJobs,
        },
        conversion: {
          current: 0,
          forecast: 0,
        },
      });
    });

    it("returns impact over 10 years for 0.1 current full-time jobs and forecast 0.3 full-time jobs in operations + 45 full-time jobs for conversion over 9 months", () => {
      const props = {
        statuQuoOperationsFullTimeJobs: 0.1,
        projectOperationsFullTimeJobs: 0.3,
        conversionFullTimeJobs: 45,

        reinstatementFullTimeJobs: 0,
        conversionSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-09-31"),
        },
        evaluationPeriodInYears: 10,
        developmentPlan,
        reinstatementExpenses: [],
      };
      const service = new FullTimeJobsImpactService(props);
      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: props.statuQuoOperationsFullTimeJobs,
        forecast: 3.675,
        operations: {
          current: props.statuQuoOperationsFullTimeJobs,
          forecast: props.projectOperationsFullTimeJobs,
        },
        conversion: {
          current: 0,
          forecast: 3.375,
        },
      });
    });

    it("returns impact over 20 years for 0.1 current FT jobs and forecast 0.3 FT jobs in operations + 20 FT jobs for conversion over 1 year + 10 FT jobs for reinstatement over 6 months", () => {
      const props = {
        statuQuoOperationsFullTimeJobs: 0.1,
        projectOperationsFullTimeJobs: 0.3,
        conversionFullTimeJobs: 20,
        reinstatementFullTimeJobs: 10,
        evaluationPeriodInYears: 20,
        conversionSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2025-01-01"),
        },
        reinstatementSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-06-30"),
        },
        developmentPlan,
        reinstatementExpenses: [],
      };
      const service = new FullTimeJobsImpactService(props);
      expect(service.getFullTimeJobsImpacts()).toEqual({
        current: props.statuQuoOperationsFullTimeJobs,
        forecast: 1.55,
        operations: {
          current: props.statuQuoOperationsFullTimeJobs,
          forecast: props.projectOperationsFullTimeJobs,
        },
        conversion: {
          current: 0,
          forecast: 1.25,
        },
      });
    });

    it("returns impact computed from default values", () => {
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
              reinstatement: (81.5 * 0.5) / 20,
              conversion: (13 * 1) / 20,
              operation: 2,
            }
          : {
              reinstatement: (81.5 * 0.5) / 20,
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
