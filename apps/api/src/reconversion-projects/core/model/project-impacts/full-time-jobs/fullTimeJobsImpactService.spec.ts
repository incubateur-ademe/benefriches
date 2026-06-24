import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AgriculturalOperationActivity, SiteNature } from "shared";

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
      buildingsFloorAreaDistribution: { RESIDENTIAL: 10000, LOCAL_STORE: 20000 },
    },
  },
];

describe("FullTimeJobsImpactService impact", () => {
  describe("for project on friche", () => {
    for (const developmentPlan of CASES) {
      it(`returns impact over 10 years for full-time jobs in operations and full-time jobs for conversion over 9 months [${developmentPlan.type}]`, () => {
        const props = {
          siteData: {
            nature: "FRICHE" as SiteNature,
            surfaceArea: 10000,
          },
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
        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: 0,
          forecast: expected.operation + expected.conversion,
          difference: expected.operation + expected.conversion,
          operations: {
            base: 0,
            forecast: expected.operation,
            difference: expected.operation,
          },
          conversion: {
            base: 0,
            forecast: expected.conversion,
            difference: expected.conversion,
          },
        });
      });

      it(`returns impact with values = 0 if no schedules are provided [${developmentPlan.type}]`, () => {
        const service = new FullTimeJobsImpactService({
          siteData: {
            nature: "FRICHE" as SiteNature,
            surfaceArea: 10000,
          },
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

        const expectedOperationsJobs =
          developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? 2 : 880;

        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: 0,
          forecast: expectedOperationsJobs,
          difference: expectedOperationsJobs,
          operations: {
            base: 0,
            forecast: expectedOperationsJobs,
            difference: expectedOperationsJobs,
          },
          conversion: {
            base: 0,
            forecast: 0,
            difference: 0,
          },
        });
      });

      it(`returns impact computed from default values with schedules [${developmentPlan.type}]`, () => {
        const service = new FullTimeJobsImpactService({
          siteData: {
            nature: "FRICHE" as SiteNature,
            surfaceArea: 10000,
          },
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
        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: 0,
          forecast: expected.reinstatement + expected.conversion + expected.operation,
          difference: expected.reinstatement + expected.conversion + expected.operation,
          operations: {
            base: 0,
            forecast: expected.operation,
            difference: expected.operation,
          },
          conversion: {
            base: 0,
            forecast: expected.conversion + expected.reinstatement,
            difference: expected.conversion + expected.reinstatement,
          },
        });
      });
    }
  });

  describe("for project on agricultural operation site", () => {
    for (const developmentPlan of CASES) {
      it(`returns impact over 10 years for full-time jobs in operations and full-time jobs for conversion over 9 months [${developmentPlan.type}]`, () => {
        const props = {
          siteData: {
            nature: "AGRICULTURAL_OPERATION" as SiteNature,
            agriculturalOperationActivity: "CATTLE_FARMING" as AgriculturalOperationActivity,
            isSiteOperated: true,
            surfaceArea: 10000,
          },
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
        const baseOperation = 1.1;
        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: baseOperation,
          forecast: expected.operation + expected.conversion,
          difference: expected.operation + expected.conversion - baseOperation,
          operations: {
            base: baseOperation,
            forecast: expected.operation,
            difference: expected.operation - baseOperation,
          },
          conversion: {
            base: 0,
            forecast: expected.conversion,
            difference: expected.conversion,
          },
        });
      });

      it(`returns impact with values = 0 if no schedules are provided [${developmentPlan.type}]`, () => {
        const service = new FullTimeJobsImpactService({
          siteData: {
            nature: "AGRICULTURAL_OPERATION" as SiteNature,
            agriculturalOperationActivity: "CATTLE_FARMING" as AgriculturalOperationActivity,
            surfaceArea: 10000,
            isSiteOperated: true,
          },
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

        const expectedOperationsJobs =
          developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? 2 : 880;
        const baseOperation = 1.1;

        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: baseOperation,
          forecast: expectedOperationsJobs,
          difference: expectedOperationsJobs - baseOperation,
          operations: {
            base: baseOperation,
            forecast: expectedOperationsJobs,
            difference: expectedOperationsJobs - baseOperation,
          },
          conversion: {
            base: 0,
            forecast: 0,
            difference: 0,
          },
        });
      });

      it(`returns impact computed from default values with schedules [${developmentPlan.type}]`, () => {
        const service = new FullTimeJobsImpactService({
          siteData: {
            nature: "AGRICULTURAL_OPERATION" as SiteNature,
            agriculturalOperationActivity: "CATTLE_FARMING" as AgriculturalOperationActivity,
            surfaceArea: 10000,
            isSiteOperated: true,
          },
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
        const baseOperation = 1.1;

        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: baseOperation,
          forecast: expected.reinstatement + expected.conversion + expected.operation,
          difference:
            expected.reinstatement + expected.conversion + expected.operation - baseOperation,
          operations: {
            base: baseOperation,
            forecast: expected.operation,
            difference: expected.operation - baseOperation,
          },
          conversion: {
            base: 0,
            forecast: expected.conversion + expected.reinstatement,
            difference: expected.conversion + expected.reinstatement,
          },
        });
      });

      it(`returns no base operation jobs if site is not operated [${developmentPlan.type}]`, () => {
        const service = new FullTimeJobsImpactService({
          siteData: {
            nature: "AGRICULTURAL_OPERATION" as SiteNature,
            agriculturalOperationActivity: "CATTLE_FARMING" as AgriculturalOperationActivity,
            surfaceArea: 10000,
            isSiteOperated: false,
          },
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
        const baseOperation = 0;

        assert.deepStrictEqual(service.getFullTimeJobsImpacts(), {
          base: baseOperation,
          forecast: expected.reinstatement + expected.conversion + expected.operation,
          difference:
            expected.reinstatement + expected.conversion + expected.operation - baseOperation,
          operations: {
            base: baseOperation,
            forecast: expected.operation,
            difference: expected.operation - baseOperation,
          },
          conversion: {
            base: 0,
            forecast: expected.conversion + expected.reinstatement,
            difference: expected.conversion + expected.reinstatement,
          },
        });
      });
    }
  });
});
