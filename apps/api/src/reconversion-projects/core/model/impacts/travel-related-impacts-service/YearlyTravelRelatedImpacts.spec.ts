/* eslint-disable @typescript-eslint/dot-notation */
import { YearlyTravelRelatedImpacts } from "./YearlyTravelRelatedImpacts";

describe("YearlyTravelRelatedImpacts", () => {
  it("computes influence radius from economic activity and public cultural and sportive buildings surfaces", () => {
    let yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 10000,
        OFFICES: 1500,
        LOCAL_STORE: 500,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
      },
    });
    expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(500);

    const props = {
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    };

    yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      ...props,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 10000,
        OFFICES: 100,
        LOCAL_STORE: 45,
      },
    });
    expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(100);
    yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      ...props,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 10000,
      },
    });
    expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(0);

    yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      ...props,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 10000,
        OFFICES: 150,
        LOCAL_STORE: 35,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 100,
      },
    });
    expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(200);

    yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      ...props,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 10000,
        OFFICES: 250,
        LOCAL_STORE: 55,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
        CULTURAL_PLACE: 30,
      },
    });
    expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(500);
  });
});
