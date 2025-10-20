import { computeAgriculturalOperationEtpFromSurface } from "./fullTimeJobs";
import { AgriculturalOperationActivity } from "./operationActivity";

const SURFACE_AREA = 15000;

describe("computeAgriculturalOperationYearlyExpenses and computeAgriculturalOperationYearlyIncomes", () => {
  it.each([
    { activity: "CEREALS_AND_OILSEEDS_CULTIVATION", value: 1 },
    { activity: "LARGE_VEGETABLE_CULTIVATION", value: 1.7 },
    { activity: "MARKET_GARDENING", value: 3.9 },
    { activity: "FLOWERS_AND_HORTICULTURE", value: 4.1 },
    { activity: "VITICULTURE", value: 2.3 },
    { activity: "FRUITS_AND_OTHER_PERMANENT_CROPS", value: 2.5 },
    { activity: "CATTLE_FARMING", value: 1.6 },
    { activity: "PIG_FARMING", value: 1.8 },
    { activity: "POULTRY_FARMING", value: 1.8 },
    { activity: "SHEEP_AND_GOAT_FARMING", value: 1.2 },
    { activity: "POLYCULTURE_AND_LIVESTOCK", value: 1.6 },
  ] as const satisfies { activity: AgriculturalOperationActivity; value: number }[])(
    "should returns $value ETP for agricultural operation: $activity",
    ({ activity, value }) => {
      const etp = computeAgriculturalOperationEtpFromSurface({
        operationActivity: activity as AgriculturalOperationActivity,
        surfaceArea: SURFACE_AREA,
      });

      expect(etp).toEqual(value);
    },
  );
});
