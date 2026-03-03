import { buildUser } from "@/features/onboarding/core/user.mock";
import {
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
} from "@/shared/core/reducers/project-form/helpers/stakeholders";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import {
  getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  getRenewableEnergyProjectAvailableStakeholders,
} from "../selectors/stakeholders.selectors";
import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";
import { exhaustiveSteps, minimalSteps } from "./projectData.mock";

const makeStep = <T>(payload: T) => ({ completed: true, payload });

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
} as const;

const USER = buildUser({ structureName: "My company" });
const MOCK_LOCAL_AUTHORITIES_SUCCESS = {
  loadingState: "success",
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
} as const;

describe("Project Stakeholders selector", () => {
  describe("getProjectAvailableStakeholders", () => {
    it("should return project developer, reinstatement expenses owner, future site owner, future site operator, site tenant and site owner and current user structure", () => {
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: siteData.tenant,
        currentUser: USER,
      });

      const stakeholders = getRenewableEnergyProjectAvailableStakeholders.resultFunc(
        availableProjectStakeholder,
        exhaustiveSteps,
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "developer company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Future operating company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Future site owner company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Reinstatement company",
          role: "project_stakeholder",
          structureType: "company",
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
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: siteData.tenant,
        currentUser: buildUser(),
      });
      const stakeholders = getRenewableEnergyProjectAvailableStakeholders.resultFunc(
        availableProjectStakeholder,
        exhaustiveSteps,
      );

      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "developer company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Future operating company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Future site owner company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Reinstatement company",
          role: "project_stakeholder",
          structureType: "company",
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
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: undefined,
        currentUser: USER,
      });
      const stakeholders = getRenewableEnergyProjectAvailableStakeholders.resultFunc(
        availableProjectStakeholder,
        minimalSteps,
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
          name: "SolarDev",
          structureType: "company",
          role: "project_stakeholder",
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
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: undefined,
        currentUser: USER,
      });

      const stepsWithOverrides: RenewableEnergyStepsState = {
        ...minimalSteps,
        RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: makeStep({
          projectDeveloper: {
            name: USER.structureName as string,
            structureType: "company",
          },
        }),
        RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: makeStep({
          futureOperator: {
            name: USER.structureName as string,
            structureType: "company",
          },
        }),
        RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: makeStep({
          futureSiteOwner: {
            name: "Future site owner company name",
            structureType: "company",
          },
        }),
        RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: makeStep({
          reinstatementContractOwner: {
            name: "Reinstatement company",
            structureType: "company",
          },
        }),
      };

      const stakeholders = getRenewableEnergyProjectAvailableStakeholders.resultFunc(
        availableProjectStakeholder,
        stepsWithOverrides,
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
          name: "Future site owner company name",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );
      expect(stakeholders).toContainEqual(
        expect.objectContaining({
          name: "Reinstatement company",
          role: "project_stakeholder",
          structureType: "company",
        }),
      );
    });
  });

  describe("getAvailableLocalAuthoritiesStakeholders", () => {
    it("should return empty array", () => {
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: undefined,
        currentUser: USER,
      });
      const availableLocalAuthoritiesStakeholders = getAvailableLocalAuthoritiesStakeholders(
        MOCK_LOCAL_AUTHORITIES_SUCCESS,
        availableProjectStakeholder,
      );

      const stepsWithLocalAuthorities: RenewableEnergyStepsState = {
        ...minimalSteps,
        RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: makeStep({
          projectDeveloper: {
            name: "Grenoble-Alpes-Métropole",
            structureType: "epci",
          },
        }),
        RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: makeStep({
          futureOperator: {
            name: "Région Auvergne-Rhône-Alpes",
            structureType: "region",
          },
        }),
        RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: makeStep({
          futureSiteOwner: {
            name: "Département Isère",
            structureType: "department",
          },
        }),
      };

      const localAuthorities =
        getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders.resultFunc(
          availableLocalAuthoritiesStakeholders,
          stepsWithLocalAuthorities,
        );

      expect(localAuthorities).toEqual([]);
    });

    it("should return all local authorities", () => {
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: { structureType: "company", name: "" },
        currentUser: USER,
      });
      const availableLocalAuthoritiesStakeholders = getAvailableLocalAuthoritiesStakeholders(
        MOCK_LOCAL_AUTHORITIES_SUCCESS,
        availableProjectStakeholder,
      );
      const localAuthorities =
        getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders.resultFunc(
          availableLocalAuthoritiesStakeholders,
          exhaustiveSteps,
        );

      expect(localAuthorities).toEqual([
        { type: "municipality", name: "Mairie de Grenoble" },
        { type: "epci", name: "Grenoble-Alpes-Métropole" },
        { type: "department", name: "Département Isère" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });

    it("should return local authorities with generic name if no data", () => {
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: siteData.tenant,
        currentUser: USER,
      });
      const availableLocalAuthoritiesStakeholders = getAvailableLocalAuthoritiesStakeholders(
        {
          loadingState: "error",
        },
        availableProjectStakeholder,
      );
      const localAuthorities =
        getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders.resultFunc(
          availableLocalAuthoritiesStakeholders,
          exhaustiveSteps,
        );

      expect(localAuthorities).toEqual([
        { type: "municipality", name: "Mairie" },
        { type: "epci", name: "Établissement public de coopération intercommunale" },
        { type: "department", name: "Département" },
        { type: "region", name: "Région" },
      ]);

      const availableLocalAuthoritiesStakeholdersWithNoEpci =
        getAvailableLocalAuthoritiesStakeholders(
          {
            loadingState: "success",
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
          availableProjectStakeholder,
        );
      const localAuthoritiesWithNoEpci =
        getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders.resultFunc(
          availableLocalAuthoritiesStakeholdersWithNoEpci,
          exhaustiveSteps,
        );

      expect(localAuthoritiesWithNoEpci).toEqual([
        { type: "epci", name: "Établissement public de coopération intercommunale" },
        { type: "department", name: "Département Isère" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });

    it("should return local authorities without current user if it is local_authority", () => {
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: siteData.tenant,
        currentUser: {
          ...USER,
          structureActivity: "department",
          structureType: "local_authority",
          structureName: "Département Isère",
        },
      });
      const availableLocalAuthoritiesStakeholders = getAvailableLocalAuthoritiesStakeholders(
        MOCK_LOCAL_AUTHORITIES_SUCCESS,
        availableProjectStakeholder,
      );
      const localAuthorities =
        getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders.resultFunc(
          availableLocalAuthoritiesStakeholders,
          exhaustiveSteps,
        );

      expect(localAuthorities).toEqual([
        { type: "epci", name: "Grenoble-Alpes-Métropole" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });

    it("should return local authorities with current user if it is local_authority but not related to the site address", () => {
      const availableProjectStakeholder = getProjectAvailableStakeholders({
        siteOwner: siteData.owner,
        siteTenant: siteData.tenant,
        currentUser: {
          ...USER,
          structureActivity: "department",
          structureType: "local_authority",
          structureName: "Département Rhône",
        },
      });
      const availableLocalAuthoritiesStakeholders = getAvailableLocalAuthoritiesStakeholders(
        MOCK_LOCAL_AUTHORITIES_SUCCESS,
        availableProjectStakeholder,
      );
      const localAuthorities =
        getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders.resultFunc(
          availableLocalAuthoritiesStakeholders,
          exhaustiveSteps,
        );

      expect(localAuthorities).toEqual([
        { type: "epci", name: "Grenoble-Alpes-Métropole" },
        { type: "department", name: "Département Isère" },
        { type: "region", name: "Région Auvergne-Rhône-Alpes" },
      ]);
    });
  });
});
