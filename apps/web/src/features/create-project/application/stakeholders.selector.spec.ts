import { RootState } from "@/app/application/store";
import { buildUser } from "@/features/users/domain/user.mock";

import { ProjectSite } from "../domain/project.types";
import { ProjectCreationState } from "./createProject.reducer";
import { projectWithExhaustiveData, projectWithMinimalData } from "./projectData.mock";
import { relatedSiteData } from "./siteData.mock";
import {
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
} from "./stakeholders.selector";

const siteData = {
  ...relatedSiteData,
  owner: {
    name: "Mairie de Grenoble",
    structureType: "municipality",
  },
  tenant: {
    name: "SARL Locataire",
    structureType: "company",
  },
} as const satisfies ProjectSite;

const USER = buildUser({ structureName: "My company" });
const MOCK_STATES = {
  projectCreation: {
    projectData: projectWithExhaustiveData,
    stepsHistory: ["PROJECT_TYPES"],
    siteData,
    siteDataLoadingState: "success",
    saveProjectLoadingState: "success",
    urbanProject: {
      createMode: undefined,
      stepsHistory: [],
      saveState: "idle",
      creationData: {},
    },
  } satisfies RootState["projectCreation"],
  currentUser: {
    currentUser: USER,
    currentUserLoaded: true,
    createUserState: "success" as const,
  },
  projectSiteLocalAuthorities: {
    loadingState: "success" as const,
    localAuthorities: {
      city: {
        code: "38185",
        name: "Grenoble",
      },
      epci: {
        code: "200040715",
        name: "Grenoble-Alpes-Métropole",
      },
      department: {
        code: "38",
        name: "Isère",
      },
      region: {
        code: "84",
        name: "Auvergne-Rhône-Alpes",
      },
    },
  },
};

describe("Project Stakeholders selector", () => {
  describe("getProjectAvailableStakeholders", () => {
    it("should return project developer, reinstatement expenses owner, future site owner, future site operator, site tenant and site owner and current user structure", () => {
      const stakeholders = getProjectAvailableStakeholders.resultFunc(
        MOCK_STATES.projectCreation,
        MOCK_STATES.currentUser,
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.projectDeveloper.name,
          role: "project_developer",
          structureType: projectWithExhaustiveData.projectDeveloper.structureType,
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.futureOperator.name,
          role: "future_operator",
          structureType: projectWithExhaustiveData.futureOperator.structureType,
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.futureSiteOwner.name,
          role: "future_site_owner",
          structureType: projectWithExhaustiveData.futureSiteOwner.structureType,
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.reinstatementContractOwner.name,
          role: "reinstatement_contract_owner",
          structureType: projectWithExhaustiveData.reinstatementContractOwner.structureType,
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: siteData.owner.name,
          role: "site_owner",
          structureType: siteData.owner.structureType,
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: siteData.tenant.name,
          role: "site_tenant",
          structureType: siteData.tenant.structureType,
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: USER.structureName,
          role: "user_structure",
          structureType: USER.structureType,
        }),
      );
    });

    it("should return project developer, reinstatement expenses owner, future site owner, future site operator, site tenant and site owner but not current user structure", () => {
      const stakeholders = getProjectAvailableStakeholders.resultFunc(MOCK_STATES.projectCreation, {
        ...MOCK_STATES.currentUser,
        currentUser: buildUser(),
      });

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.projectDeveloper.name,
          role: "project_developer",
          structureType: projectWithExhaustiveData.projectDeveloper.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.futureOperator.name,
          role: "future_operator",
          structureType: projectWithExhaustiveData.futureOperator.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.futureSiteOwner.name,
          role: "future_site_owner",
          structureType: projectWithExhaustiveData.futureSiteOwner.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.reinstatementContractOwner.name,
          role: "reinstatement_contract_owner",
          structureType: projectWithExhaustiveData.reinstatementContractOwner.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: siteData.owner.name,
          role: "site_owner",
          structureType: siteData.owner.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: siteData.tenant.name,
          role: "site_tenant",
          structureType: siteData.tenant.structureType,
        }),
      );
      expect(stakeholders).not.toContainEqual(
        expect.objectContaining({
          name: USER.structureName,
          role: "user_structure",
          structureType: USER.structureType,
        }),
      );
    });

    it("should return only future site owner, project developer and current user structure", () => {
      const stakeholders = getProjectAvailableStakeholders.resultFunc(
        {
          ...MOCK_STATES.projectCreation,
          projectData: projectWithMinimalData,
          siteData: { ...siteData, tenant: undefined },
        } as ProjectCreationState,
        MOCK_STATES.currentUser,
      );

      expect(stakeholders.length).toEqual(3);

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: siteData.owner.name,
          role: "site_owner",
          structureType: siteData.owner.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithMinimalData.projectDeveloper.name,
          structureType: projectWithMinimalData.projectDeveloper.structureType,
          role: "project_developer",
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: USER.structureName,
          role: "user_structure",
          structureType: USER.structureType,
        }),
      );
    });

    it("should return only future site owner, Reinstatement company, site owner and current user structure", () => {
      const stakeholders = getProjectAvailableStakeholders.resultFunc(
        {
          ...MOCK_STATES.projectCreation,
          projectData: {
            ...projectWithMinimalData,
            projectDeveloper: {
              name: USER.structureName,
              structureType: "company",
            },
            futureOperator: {
              name: USER.structureName,
              structureType: "company",
            },
            futureSiteOwner: {
              name: "Future site owner company name",
              structureType: "company",
            },
            reinstatementContractOwner: {
              name: "Reinstatement company",
              structureType: "company",
            },
          },
          siteData: { ...siteData, tenant: undefined },
        } as ProjectCreationState,
        MOCK_STATES.currentUser,
      );

      expect(stakeholders.length).toEqual(4);

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: siteData.owner.name,
          role: "site_owner",
          structureType: siteData.owner.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: USER.structureName,
          role: "user_structure",
          structureType: USER.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.futureSiteOwner.name,
          role: "future_site_owner",
          structureType: projectWithExhaustiveData.futureSiteOwner.structureType,
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: projectWithExhaustiveData.reinstatementContractOwner.name,
          role: "reinstatement_contract_owner",
          structureType: projectWithExhaustiveData.reinstatementContractOwner.structureType,
        }),
      );
    });
  });

  describe("getAvailableLocalAuthoritiesStakeholders", () => {
    it("should return empty array", () => {
      const localAuthorities = getAvailableLocalAuthoritiesStakeholders.resultFunc(
        MOCK_STATES.projectSiteLocalAuthorities,
        {
          ...MOCK_STATES.projectCreation,
          projectData: {
            ...projectWithMinimalData,
            projectDeveloper: {
              name: "Grenoble-Alpes-Métropole",
              structureType: "epci",
            },
            futureOperator: {
              name: "Région Auvergne-Rhône-Alpes",
              structureType: "region",
            },
            futureSiteOwner: {
              name: "Département Isère",
              structureType: "department",
            },
          },
        },
        MOCK_STATES.currentUser,
      );

      expect(localAuthorities).toEqual([]);
    });

    it("should return all local authorities", () => {
      const localAuthorities = getAvailableLocalAuthoritiesStakeholders.resultFunc(
        MOCK_STATES.projectSiteLocalAuthorities,
        {
          ...MOCK_STATES.projectCreation,
          siteData: { ...siteData, owner: { structureType: "company", name: "" } },
        } as ProjectCreationState,
        MOCK_STATES.currentUser,
      );

      expect(localAuthorities).toEqual([
        { type: "municipality", name: "Mairie de Grenoble" },
        { type: "epci", name: "Grenoble-Alpes-Métropole" },
        { type: "department", name: "Département Isère" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });

    it("should return local authorities with generic name if no data", () => {
      const localAuthorities = getAvailableLocalAuthoritiesStakeholders.resultFunc(
        {
          loadingState: "error",
          localAuthorities: undefined,
        },
        MOCK_STATES.projectCreation,
        MOCK_STATES.currentUser,
      );

      expect(localAuthorities).toEqual([
        { type: "municipality", name: "Mairie" },
        { type: "epci", name: "Établissement public de coopération intercommunale" },
        { type: "department", name: "Département" },
        { type: "region", name: "Région" },
      ]);

      const localAuthoritiesWithNoEpci = getAvailableLocalAuthoritiesStakeholders.resultFunc(
        {
          loadingState: "success",
          localAuthorities: {
            city: {
              code: "38185",
              name: "Grenoble",
            },
            department: {
              code: "38",
              name: "Isère",
            },
            region: {
              code: "84",
              name: "Auvergne-Rhône-Alpes",
            },
          },
        },
        MOCK_STATES.projectCreation,
        MOCK_STATES.currentUser,
      );

      expect(localAuthoritiesWithNoEpci).toEqual([
        { type: "epci", name: "Établissement public de coopération intercommunale" },
        { type: "department", name: "Département Isère" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });

    it("should return local authorities without current user if it is local_authority", () => {
      const localAuthorities = getAvailableLocalAuthoritiesStakeholders.resultFunc(
        MOCK_STATES.projectSiteLocalAuthorities,
        MOCK_STATES.projectCreation,
        {
          ...MOCK_STATES.currentUser,
          currentUser: {
            ...MOCK_STATES.currentUser.currentUser,
            structureActivity: "department",
            structureType: "local_authority",
            structureName: "Département Isère",
          },
        },
      );

      expect(localAuthorities).toEqual([
        { type: "epci", name: "Grenoble-Alpes-Métropole" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });

    it("should return local authorities with current user if it is local_authority but not related to the site address", () => {
      const localAuthorities = getAvailableLocalAuthoritiesStakeholders.resultFunc(
        MOCK_STATES.projectSiteLocalAuthorities,
        MOCK_STATES.projectCreation,
        {
          ...MOCK_STATES.currentUser,
          currentUser: {
            ...MOCK_STATES.currentUser.currentUser,
            structureActivity: "department",
            structureType: "local_authority",
            structureName: "Département Rhône",
          },
        },
      );

      expect(localAuthorities).toEqual([
        { type: "epci", name: "Grenoble-Alpes-Métropole" },
        { type: "department", name: "Département Isère" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });
  });
});
