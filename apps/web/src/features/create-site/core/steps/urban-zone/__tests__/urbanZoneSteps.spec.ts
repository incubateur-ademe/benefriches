import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectStepReverted,
  StoreBuilder,
} from "../../../__tests__/creation-steps/testUtils";
import { stepReverted } from "../../../actions/revert.action";
import { addressStepCompleted } from "../../address/address.actions";
import { siteNatureCompleted } from "../../introduction/introduction.actions";
import { siteSurfaceAreaStepCompleted } from "../../spaces/spaces.actions";
import { urbanZoneTypeCompleted } from "../urbanZone.actions";

describe("Site creation: urban zone steps", () => {
  describe("SITE_NATURE → URBAN_ZONE_TYPE routing", () => {
    it("goes to URBAN_ZONE_TYPE step when URBAN_ZONE nature is selected", () => {
      const store = new StoreBuilder().withStepsHistory(["SITE_NATURE"]).build();
      const initialRootState = store.getState();

      store.dispatch(siteNatureCompleted({ nature: "URBAN_ZONE" }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { nature: "URBAN_ZONE" });
      expectNewCurrentStep(initialRootState, newState, "URBAN_ZONE_TYPE");
    });

    it("goes to AGRICULTURAL_OPERATION_ACTIVITY step for AGRICULTURAL_OPERATION site", () => {
      const store = new StoreBuilder().withStepsHistory(["SITE_NATURE"]).build();
      const initialRootState = store.getState();

      store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "AGRICULTURAL_OPERATION_ACTIVITY");
    });
  });

  describe("URBAN_ZONE_TYPE", () => {
    it("goes to ADDRESS step and sets createMode to custom when urban zone type is selected", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SITE_NATURE", "URBAN_ZONE_TYPE"])
        .withCreationData({ nature: "URBAN_ZONE" })
        .build();
      const initialRootState = store.getState();

      store.dispatch(urbanZoneTypeCompleted({ urbanZoneType: "ECONOMIC_ACTIVITY_ZONE" }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { urbanZoneType: "ECONOMIC_ACTIVITY_ZONE" });
      expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      expect(newState.siteCreation.createMode).toBe("custom");
    });

    it("goes to previous step and unsets urban zone type when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SITE_NATURE", "URBAN_ZONE_TYPE"])
        .withCreationData({ nature: "URBAN_ZONE", urbanZoneType: "ECONOMIC_ACTIVITY_ZONE" })
        .build();
      const initialRootState = store.getState();

      store.dispatch(stepReverted());

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { urbanZoneType: undefined });
      expectStepReverted(initialRootState, newState);
    });
  });

  describe("ADDRESS → URBAN_ZONE_LAND_PARCELS_INTRODUCTION routing for URBAN_ZONE", () => {
    it("goes to URBAN_ZONE_LAND_PARCELS_INTRODUCTION step when address is completed for urban zone", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["ADDRESS"])
        .withCreateMode("custom")
        .withCreationData({
          nature: "URBAN_ZONE",
          address: {
            value: "1 rue de la Paix, 75001 Paris",
            city: "Paris",
            cityCode: "75001",
            postCode: "75001",
            banId: "75056_9575_00001",
            lat: 48.8698,
            long: 2.3322,
          },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        addressStepCompleted({
          address: {
            value: "1 rue de la Paix, 75001 Paris",
            city: "Paris",
            cityCode: "75001",
            postCode: "75001",
            banId: "75056_9575_00001",
            lat: 48.8698,
            long: 2.3322,
          },
        }),
      );

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "URBAN_ZONE_LAND_PARCELS_INTRODUCTION");
    });

    it.each(["FRICHE", "AGRICULTURAL_OPERATION", "NATURAL_AREA"] as const)(
      "goes to SPACES_INTRODUCTION for site nature: %s",
      (siteNature) => {
        const store = new StoreBuilder()
          .withStepsHistory(["ADDRESS"])
          .withCreationData({ nature: siteNature })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          addressStepCompleted({
            address: {
              value: "1 rue de la Paix, 75001 Paris",
              city: "Paris",
              cityCode: "75001",
              postCode: "75001",
              banId: "75056_9575_00001",
              lat: 48.8698,
              long: 2.3322,
            },
          }),
        );

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "SPACES_INTRODUCTION");
      },
    );

    it("still goes to SPACES_INTRODUCTION for non-urban-zone custom sites", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["ADDRESS"])
        .withCreateMode("custom")
        .withCreationData({ nature: "AGRICULTURAL_OPERATION" })
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        addressStepCompleted({
          address: {
            value: "1 rue de la Paix, 75001 Paris",
            city: "Paris",
            cityCode: "75001",
            postCode: "75001",
            banId: "75056_9575_00001",
            lat: 48.8698,
            long: 2.3322,
          },
        }),
      );

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "SPACES_INTRODUCTION");
    });
  });

  describe("SURFACE_AREA → LAND_PARCELS_SELECTION for URBAN_ZONE", () => {
    it("advances to land parcels selection when surface area is completed for urban zone", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SURFACE_AREA"])
        .withCreateMode("custom")
        .withCreationData({ nature: "URBAN_ZONE" })
        .build();
      const initialRootState = store.getState();

      store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 15000 }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { surfaceArea: 15000 });
      // Steps history should include the urban zone step handler entry
      expect(newState.siteCreation.stepsHistory).toEqual([
        "SURFACE_AREA",
        "URBAN_ZONE_LAND_PARCELS_SELECTION",
      ]);
      expect(newState.siteCreation.urbanZone.currentStep).toBe("URBAN_ZONE_LAND_PARCELS_SELECTION");
    });

    it("still goes to SPACES_KNOWLEDGE for non-urban-zone custom sites", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SURFACE_AREA"])
        .withCreateMode("custom")
        .withCreationData({ nature: "AGRICULTURAL_OPERATION" })
        .build();
      const initialRootState = store.getState();

      store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 15000 }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "SPACES_KNOWLEDGE");
    });
  });
});
