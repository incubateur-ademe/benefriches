import { StoreBuilder } from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";

import { selectUrbanZoneFinalSummaryViewData } from "./finalSummary.selectors";

describe("selectUrbanZoneFinalSummaryViewData - managerName", () => {
  it("should return undefined managerName when no manager step is completed", () => {
    const store = new StoreBuilder().build();

    const viewData = selectUrbanZoneFinalSummaryViewData(store.getState());

    expect(viewData.managerStructureType).toBeUndefined();
    expect(viewData.managerName).toBeUndefined();
  });

  it("should return undefined managerName when manager is activity_park_manager", () => {
    const store = new StoreBuilder()
      .withUrbanZoneSteps({
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: { structureType: "activity_park_manager" },
        },
      })
      .build();

    const viewData = selectUrbanZoneFinalSummaryViewData(store.getState());

    expect(viewData.managerStructureType).toBe("activity_park_manager");
    expect(viewData.managerName).toBeUndefined();
  });

  it("should return local authority name from step data when manager is local_authority", () => {
    const store = new StoreBuilder()
      .withUrbanZoneSteps({
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: {
            structureType: "local_authority",
            localAuthority: "municipality",
            localAuthorityName: "Mairie de Lyon",
          },
        },
      })
      .build();

    const viewData = selectUrbanZoneFinalSummaryViewData(store.getState());

    expect(viewData.managerStructureType).toBe("local_authority");
    expect(viewData.managerName).toBe("Mairie de Lyon");
  });

  it("should return department name from step data", () => {
    const store = new StoreBuilder()
      .withUrbanZoneSteps({
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: {
            structureType: "local_authority",
            localAuthority: "department",
            localAuthorityName: "Département du Rhône",
          },
        },
      })
      .build();

    const viewData = selectUrbanZoneFinalSummaryViewData(store.getState());

    expect(viewData.managerStructureType).toBe("local_authority");
    expect(viewData.managerName).toBe("Département du Rhône");
  });
});
