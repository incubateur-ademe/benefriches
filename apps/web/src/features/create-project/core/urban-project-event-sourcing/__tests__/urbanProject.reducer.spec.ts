import { describe, it, expect } from "vitest";

import { FormEvent, SerializedAnswerSetEvent } from "../form-events/FormEvent.type";
import { completeStep } from "../urbanProject.actions";
import { AnswersByStep, AnswerStepId } from "../urbanProjectSteps";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

const createAnswerEvent = <T extends AnswerStepId>(
  stepId: T,
  payload: AnswersByStep[T],
  timestamp: number = Date.now(),
  source: "user" | "system" = "user",
): SerializedAnswerSetEvent<T> => ({
  stepId,
  type: "ANSWER_SET",
  payload,
  timestamp,
  source,
});

describe("urbanProject.reducer - completeStep action", () => {
  describe("ANSWER_DELETED events generation", () => {
    describe("Space categories selection changes", () => {
      it("should delete dependent answers when removing LIVING_AND_ACTIVITY_SPACES category", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
          }),
          createAnswerEvent("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", {
            spacesCategoriesDistribution: {
              LIVING_AND_ACTIVITY_SPACES: 5000,
              GREEN_SPACES: 3000,
            },
          }),
          createAnswerEvent("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION", {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 2000,
              PRIVATE_GREEN_SPACES: 3000,
            },
          }),
          createAnswerEvent("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA", {
            buildingsFloorSurfaceArea: 4000,
          }),
          createAnswerEvent("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION", {
            buildingsUsesDistribution: { RESIDENTIAL: 3000, LOCAL_STORE: 1000 },
          }),
        ];

        const store = createTestStore({
          events: initialEvents,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        });

        // Modification : suppression de LIVING_AND_ACTIVITY_SPACES
        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["GREEN_SPACES"] },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(deletionEvents).toHaveLength(4);
        expect(deletionEvents.map((e) => e.stepId)).toContain(
          "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
        );
        expect(deletionEvents.map((e) => e.stepId)).toContain(
          "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
        );
        expect(deletionEvents.map((e) => e.stepId)).toContain(
          "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
        );
        expect(deletionEvents.map((e) => e.stepId)).toContain(
          "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
        );
      });

      it("should delete green spaces answers when removing GREEN_SPACES category", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
          }),
          createAnswerEvent("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION", {
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 2000, TREE_FILLED_SPACE: 1000 },
          }),
        ];

        const store = createTestStore({
          events: initialEvents,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(
          deletionEvents.some(
            (e) => e.stepId === "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          ),
        ).toBe(true);
      });
    });

    describe("Buildings-related changes", () => {
      it("should delete building steps when removing buildings from residential spaces", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION", {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 2000,
              PRIVATE_GREEN_SPACES: 3000,
            },
          }),
          createAnswerEvent("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA", {
            buildingsFloorSurfaceArea: 4000,
          }),
          createAnswerEvent("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION", {
            buildingsUsesDistribution: { RESIDENTIAL: 3000, LOCAL_STORE: 1000 },
          }),
          createAnswerEvent("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION", {
            buildingsResalePlannedAfterDevelopment: false,
          }),
        ];

        const store = createTestStore({ events: initialEvents });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            answers: {
              livingAndActivitySpacesDistribution: {
                PRIVATE_GREEN_SPACES: 5000,
              },
            },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(
          deletionEvents.some((e) => e.stepId === "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"),
        ).toBe(true);
        expect(
          deletionEvents.some(
            (e) => e.stepId === "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          ),
        ).toBe(true);
        expect(
          deletionEvents.some((e) => e.stepId === "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION"),
        ).toBe(true);
      });

      it("should delete operating expenses when changing buildings resale to true", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION", {
            buildingsResalePlannedAfterDevelopment: false,
          }),
          createAnswerEvent("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES", {
            yearlyProjectedBuildingsOperationsExpenses: [{ purpose: "maintenance", amount: 50000 }],
          }),
        ];

        const store = createTestStore({ events: initialEvents });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            answers: { buildingsResalePlannedAfterDevelopment: true },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(
          deletionEvents.some(
            (e) => e.stepId === "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
          ),
        ).toBe(true);
      });
    });

    describe("Site resale changes", () => {
      it("should delete site resale revenue when changing resale plan to false", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent("URBAN_PROJECT_SITE_RESALE_SELECTION", {
            siteResalePlannedAfterDevelopment: true,
          }),
          createAnswerEvent("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE", {
            siteResaleExpectedSellingPrice: 100000,
            siteResaleExpectedPropertyTransferDuties: 5000,
          }),
        ];

        const store = createTestStore({
          events: initialEvents,
          currentStep: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            answers: { siteResalePlannedAfterDevelopment: false },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(
          deletionEvents.some((e) => e.stepId === "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"),
        ).toBe(true);
      });
    });

    describe("Decontamination changes", () => {
      it("should delete reinstatement expenses when changing decontamination settings", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent(
            "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
            {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
            Date.now(),
            "system",
          ),
          createAnswerEvent("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION", {
            decontaminationPlan: "partial",
          }),
        ];

        const store = createTestStore({
          events: initialEvents,
          currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          siteData: { ...mockSiteData, hasContaminatedSoils: true },
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(
          deletionEvents.some((e) => e.stepId === "URBAN_PROJECT_EXPENSES_REINSTATEMENT"),
        ).toBe(true);
      });

      it('should automatically set decontamination surface area for "none" plan', () => {
        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          siteData: { ...mockSiteData, hasContaminatedSoils: true },
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );

        const surfaceAreaEvent = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.find(
            (event) =>
              event.type === "ANSWER_SET" &&
              event.stepId === "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          ) as SerializedAnswerSetEvent<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA">;

        expect(surfaceAreaEvent).toBeDefined();
        expect(surfaceAreaEvent.payload.decontaminatedSurfaceArea).toBe(0);
      });

      it('should automatically set decontamination surface area for "unknown" plan', () => {
        const contaminatedSoilSurface = 1000;
        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          siteData: {
            ...mockSiteData,
            hasContaminatedSoils: true,
            contaminatedSoilSurface,
          },
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "unknown" },
          }),
        );

        const surfaceAreaEvent = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.find(
            (event) =>
              event.type === "ANSWER_SET" &&
              event.stepId === "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          ) as SerializedAnswerSetEvent<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA">;

        expect(surfaceAreaEvent).toBeDefined();
        expect(surfaceAreaEvent.payload.decontaminatedSurfaceArea).toBe(
          contaminatedSoilSurface * 0.25,
        );
      });
    });

    describe("Surface area distribution changes", () => {
      it("should delete system-generated reinstatement expenses when surface areas change", () => {
        const initialEvents: FormEvent[] = [
          createAnswerEvent(
            "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 5000 },
            },
            Date.now(),
            "system",
          ),
          createAnswerEvent(
            "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
            {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
            Date.now(),
            "system",
          ),
          createAnswerEvent("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", {
            spacesCategoriesDistribution: { GREEN_SPACES: 5000 },
          }),
        ];

        const store = createTestStore({
          events: initialEvents,
          currentStep: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
            },
          }),
        );

        const deletionEvents = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.filter(
            (event) => event.type === "ANSWER_DELETED",
          );

        expect(
          deletionEvents.some((e) => e.stepId === "URBAN_PROJECT_EXPENSES_REINSTATEMENT"),
        ).toBe(true);
      });
    });

    describe("Single category shortcut", () => {
      it("should automatically set surface area for single category selection", () => {
        const surfaceArea = 10000;

        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          siteData: { ...mockSiteData, surfaceArea },
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["GREEN_SPACES"] },
          }),
        );

        // Vérifier qu'un événement système a été créé pour la surface
        const surfaceEvent = store
          .getState()
          .projectCreation.urbanProjectEventSourcing.events.find(
            (event) =>
              event.type === "ANSWER_SET" &&
              event.stepId === "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA" &&
              event.source === "system",
          ) as SerializedAnswerSetEvent<"URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA">;

        expect(surfaceEvent).toBeDefined();
        expect(surfaceEvent.payload.spacesCategoriesDistribution?.GREEN_SPACES).toBe(surfaceArea);

        expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
          "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
        );
      });
    });
  });

  describe("Event ordering and timestamps", () => {
    it("should maintain event order with proper timestamps", () => {
      const initialEvents: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
          },
          1000,
        ),
      ];

      const store = createTestStore({
        events: initialEvents,
        currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      });

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: { spacesCategories: ["GREEN_SPACES"] },
        }),
      );

      const newEvents = store
        .getState()
        .projectCreation.urbanProjectEventSourcing.events.filter((e) => e.timestamp > 1000);
      expect(newEvents.length).toBeGreaterThan(0);

      const timestamps = store
        .getState()
        .projectCreation.urbanProjectEventSourcing.events.map((e) => e.timestamp);
      expect(timestamps).toEqual([...timestamps].sort());
    });
  });
});
