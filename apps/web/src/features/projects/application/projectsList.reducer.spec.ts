import { v4 as uuid } from "uuid";

import { createStore } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { ReconversionProjectsGroupedBySite } from "../domain/projects.types";
import { InMemoryReconversionProjectsListService } from "../infrastructure/projects-list-service/InMemoryProjectsListService";
import { fetchReconversionProjects } from "./projectsList.actions";
import { selectComparableProjects, selectReconversionProjectById } from "./projectsList.reducer";

describe("Projects list reducer", () => {
  const reconversionProjectIdA = uuid();
  const reconversionProjectIdB = uuid();
  const reconversionProjects: ReconversionProjectsGroupedBySite = [
    {
      siteId: uuid(),
      siteName: "Site 1",
      isFriche: true,
      isExpressSite: true,
      reconversionProjects: [],
    },
    {
      siteId: uuid(),
      siteName: "Site 2",
      isFriche: false,
      isExpressSite: false,
      reconversionProjects: [
        {
          id: reconversionProjectIdA,
          name: "Reconversion project A on site 2",
          type: "PHOTOVOLTAIC_POWER_PLANT",
          isExpressProject: false,
        },
        {
          id: reconversionProjectIdB,
          name: "Reconversion project B on site 2",
          type: "MIXED_USE_NEIGHBOURHOOD",
          isExpressProject: true,
        },
      ],
    },
  ] as const;

  describe("fetchReconversionProjects action", () => {
    it("should fetch reconversion projects and store them", async () => {
      const store = createStore(
        getTestAppDependencies({
          reconversionProjectsListService: new InMemoryReconversionProjectsListService(
            reconversionProjects,
          ),
        }),
      );

      await store.dispatch(fetchReconversionProjects({ userId: "user123" }));

      const state = store.getState();

      expect(state.reconversionProjectsList).toEqual({
        reconversionProjectsLoadingState: "success",
        reconversionProjects,
      });
    });

    it("should be in error state when fetching failed", async () => {
      const store = createStore(
        getTestAppDependencies({
          reconversionProjectsListService: new InMemoryReconversionProjectsListService([], true),
        }),
      );

      await store.dispatch(fetchReconversionProjects({ userId: "user123" }));

      const state = store.getState();

      expect(state.reconversionProjectsList).toEqual({
        reconversionProjectsLoadingState: "error",
        reconversionProjects: [],
      });
    });
  });

  describe("selectReconversionProjectById selector", () => {
    it("should get reconversion project with given id when it exists", () => {
      const store = createStore(getTestAppDependencies(), {
        reconversionProjectsList: {
          reconversionProjects: reconversionProjects,
          reconversionProjectsLoadingState: "success",
        },
      });
      const reconversionProject = selectReconversionProjectById(
        store.getState(),
        reconversionProjectIdB,
      );

      expect(reconversionProject).toEqual({
        id: reconversionProjectIdB,
        name: "Reconversion project B on site 2",
        type: "MIXED_USE_NEIGHBOURHOOD",
        site: { id: reconversionProjects[1]?.siteId, name: "Site 2" },
      });
    });

    it("should get undefined when given id does not exist", () => {
      const store = createStore(getTestAppDependencies(), {
        reconversionProjectsList: {
          reconversionProjects: reconversionProjects,
          reconversionProjectsLoadingState: "success",
        },
      });
      const reconversionProject = selectReconversionProjectById(store.getState(), uuid());

      expect(reconversionProject).toEqual(undefined);
    });
  });

  describe("selectComparableProjects selector", () => {
    it("should get empty array when no other projects on site", () => {
      const rpId = uuid();
      const reconversionProjects: ReconversionProjectsGroupedBySite = [
        {
          siteId: uuid(),
          siteName: "Site 1",
          isFriche: true,
          isExpressSite: false,
          reconversionProjects: [],
        },
        {
          siteId: uuid(),
          siteName: "Site 2",
          isFriche: false,
          isExpressSite: true,
          reconversionProjects: [
            {
              id: rpId,
              name: "Reconversion project A on site 2",
              type: "PHOTOVOLTAIC_POWER_PLANT",
              isExpressProject: false,
            },
          ],
        },
      ] as const;
      const store = createStore(getTestAppDependencies(), {
        reconversionProjectsList: {
          reconversionProjects: reconversionProjects,
          reconversionProjectsLoadingState: "success",
        },
      });

      expect(selectComparableProjects(store.getState(), rpId)).toEqual([]);
    });

    it("should get reconversion projects on same site when given id exists", () => {
      const store = createStore(getTestAppDependencies(), {
        reconversionProjectsList: {
          reconversionProjects: reconversionProjects,
          reconversionProjectsLoadingState: "success",
        },
      });

      expect(selectComparableProjects(store.getState(), reconversionProjectIdB)).toEqual([
        {
          id: reconversionProjectIdA,
          name: "Reconversion project A on site 2",
          type: "PHOTOVOLTAIC_POWER_PLANT",
          isExpressProject: false,
        },
      ]);
    });
  });
});
