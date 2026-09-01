import type { GetSiteFeaturesResponseDto } from "shared";
import { describe, expect, it } from "vitest";

import { deriveSiteDataFromCustomSteps } from "@/features/create-site/core/custom/customSteps";
import { customStepHandlerRegistry } from "@/features/create-site/core/custom/stepHandlerRegistry";
import type { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { convertSiteToCustomSteps, getFirstCustomStepForNature } from "./convertSiteToCustomSteps";

const BASE_ADDRESS = {
  banId: "addr-1",
  city: "Paris",
  cityCode: "75056",
  postCode: "75001",
  streetName: "Rue de Paris",
  streetNumber: "1",
  value: "1 Rue de Paris, 75001 Paris",
  long: 2.35,
  lat: 48.85,
};

const FRICHE_FEATURES: GetSiteFeaturesResponseDto = {
  id: "site-1",
  name: "Friche Duchamp",
  description: "Une friche industrielle",
  nature: "FRICHE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  tenant: { structureType: "private_individual", name: "Tenant Name" },
  soilsDistribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 6000 },
  surfaceArea: 10000,
  address: BASE_ADDRESS,
  yearlyExpenses: [{ amount: 3000, purpose: "security", bearer: "tenant" }],
  yearlyIncomes: [],
  fricheActivity: "INDUSTRY",
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2000,
  accidentsMinorInjuries: 1,
  accidentsSevereInjuries: 0,
  accidentsDeaths: 0,
};

const AGRICULTURAL_FEATURES: GetSiteFeaturesResponseDto = {
  id: "site-2",
  name: "Exploitation viticole",
  nature: "AGRICULTURAL_OPERATION",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  tenant: { structureType: "company", name: "Tenant Farm" },
  soilsDistribution: { PRAIRIE_GRASS: 8000, MINERAL_SOIL: 2000 },
  surfaceArea: 10000,
  address: BASE_ADDRESS,
  yearlyExpenses: [{ amount: 1000, purpose: "taxes", bearer: "owner" }],
  yearlyIncomes: [{ amount: 5000, source: "operations" }],
  agriculturalOperationActivity: "VITICULTURE",
  isSiteOperated: true,
};

const NATURAL_AREA_FEATURES: GetSiteFeaturesResponseDto = {
  id: "site-3",
  name: "Forêt de Sologne",
  nature: "NATURAL_AREA",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  soilsDistribution: { FOREST_MIXED: 15000 },
  surfaceArea: 15000,
  address: BASE_ADDRESS,
  yearlyExpenses: [],
  yearlyIncomes: [],
  naturalAreaType: "FOREST",
};

describe("convertSiteToCustomSteps", () => {
  describe("FRICHE", () => {
    it("hydrates every friche step as completed with the exact CustomAnswersByStep shapes", () => {
      const steps = convertSiteToCustomSteps(FRICHE_FEATURES);

      expect(steps.FRICHE_ACTIVITY).toEqual({ completed: true, payload: "INDUSTRY" });
      expect(steps.ADDRESS).toEqual({ completed: true, payload: { address: BASE_ADDRESS } });
      expect(steps.SURFACE_AREA).toEqual({ completed: true, payload: { surfaceArea: 10000 } });
      expect(steps.SPACES_KNOWLEDGE).toEqual({ completed: true, payload: { knowsSpaces: true } });
      expect(steps.SPACES_SELECTION).toEqual({
        completed: true,
        payload: {
          soils: ["BUILDINGS", "IMPERMEABLE_SOILS"],
          soilsDistribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 6000 },
        },
      });
      expect(steps.SOILS_CONTAMINATION).toEqual({
        completed: true,
        payload: { hasContaminatedSoils: true, contaminatedSoilSurface: 2000 },
      });
      expect(steps.FRICHE_ACCIDENTS).toEqual({
        completed: true,
        payload: {
          hasRecentAccidents: true,
          accidentsMinorInjuries: 1,
          accidentsSevereInjuries: 0,
          accidentsDeaths: 0,
        },
      });
      expect(steps.OWNER).toEqual({
        completed: true,
        payload: { owner: { structureType: "company", name: "Owner Corp" } },
      });
      expect(steps.IS_FRICHE_LEASED).toEqual({
        completed: true,
        payload: { isFricheLeased: true },
      });
      expect(steps.TENANT).toEqual({
        completed: true,
        payload: { tenant: { structureType: "private_individual", name: "Tenant Name" } },
      });
      expect(steps.YEARLY_EXPENSES).toEqual({
        completed: true,
        payload: [{ amount: 3000, purpose: "security", bearer: "tenant" }],
      });
      expect(steps.NAMING).toEqual({
        completed: true,
        payload: { name: "Friche Duchamp", description: "Une friche industrielle" },
      });
    });

    it("preserves each expense's own bearer instead of defaulting them all to owner", () => {
      const steps = convertSiteToCustomSteps({
        ...FRICHE_FEATURES,
        yearlyExpenses: [
          { amount: 3000, purpose: "security", bearer: "tenant" },
          { amount: 500, purpose: "propertyTaxes", bearer: "owner" },
        ],
      });

      expect(steps.YEARLY_EXPENSES).toEqual({
        completed: true,
        payload: [
          { amount: 3000, purpose: "security", bearer: "tenant" },
          { amount: 500, purpose: "propertyTaxes", bearer: "owner" },
        ],
      });
    });

    it("hydrates IS_FRICHE_LEASED as false and leaves TENANT absent when there is no tenant", () => {
      const steps = convertSiteToCustomSteps({ ...FRICHE_FEATURES, tenant: undefined });

      expect(steps.IS_FRICHE_LEASED).toEqual({
        completed: true,
        payload: { isFricheLeased: false },
      });
      expect(steps.TENANT).toBeUndefined();
    });

    it("hydrates FRICHE_ACCIDENTS as false with no injury numbers when there were no accidents", () => {
      const steps = convertSiteToCustomSteps({
        ...FRICHE_FEATURES,
        accidentsMinorInjuries: undefined,
        accidentsSevereInjuries: undefined,
        accidentsDeaths: undefined,
      });

      expect(steps.FRICHE_ACCIDENTS).toEqual({
        completed: true,
        payload: { hasRecentAccidents: false },
      });
    });
  });

  describe("AGRICULTURAL_OPERATION", () => {
    it("hydrates IS_SITE_OPERATED true, OPERATOR with the tenant, and YEARLY_INCOME when the site is operated", () => {
      const steps = convertSiteToCustomSteps(AGRICULTURAL_FEATURES);

      expect(steps.AGRICULTURAL_OPERATION_ACTIVITY).toEqual({
        completed: true,
        payload: { activity: "VITICULTURE" },
      });
      expect(steps.IS_SITE_OPERATED).toEqual({
        completed: true,
        payload: { isSiteOperated: true },
      });
      expect(steps.OPERATOR).toEqual({
        completed: true,
        payload: { tenant: { structureType: "company", name: "Tenant Farm" } },
      });
      expect(steps.YEARLY_INCOME).toEqual({
        completed: true,
        payload: [{ amount: 5000, source: "operations" }],
      });
    });

    it("hydrates IS_SITE_OPERATED false and leaves OPERATOR and YEARLY_INCOME absent when the site is not operated", () => {
      const steps = convertSiteToCustomSteps({
        ...AGRICULTURAL_FEATURES,
        tenant: undefined,
        isSiteOperated: false,
        yearlyIncomes: [],
      });

      expect(steps.IS_SITE_OPERATED).toEqual({
        completed: true,
        payload: { isSiteOperated: false },
      });
      expect(steps.OPERATOR).toBeUndefined();
      expect(steps.YEARLY_INCOME).toBeUndefined();
    });
  });

  describe("NATURAL_AREA", () => {
    it("hydrates NATURAL_AREA_TYPE, the spaces chain, OWNER and NAMING, with no contamination/accidents/expenses/income steps", () => {
      const steps = convertSiteToCustomSteps(NATURAL_AREA_FEATURES);

      expect(steps.NATURAL_AREA_TYPE).toEqual({
        completed: true,
        payload: { naturalAreaType: "FOREST" },
      });
      expect(steps.OWNER).toBeDefined();
      expect(steps.NAMING).toBeDefined();
      expect(steps.SOILS_CONTAMINATION).toBeUndefined();
      expect(steps.FRICHE_ACCIDENTS).toBeUndefined();
      expect(steps.YEARLY_EXPENSES).toBeUndefined();
      expect(steps.YEARLY_INCOME).toBeUndefined();
      expect(steps.IS_FRICHE_LEASED).toBeUndefined();
      expect(steps.IS_SITE_OPERATED).toBeUndefined();
    });
  });

  describe("spaces distribution branch", () => {
    it("hydrates SPACES_SELECTION only (no distribution steps) for a single soil type", () => {
      const steps = convertSiteToCustomSteps(NATURAL_AREA_FEATURES);

      expect(steps.SPACES_SELECTION).toEqual({
        completed: true,
        payload: { soils: ["FOREST_MIXED"], soilsDistribution: { FOREST_MIXED: 15000 } },
      });
      expect(steps.SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE).toBeUndefined();
      expect(steps.SPACES_SURFACE_AREA_DISTRIBUTION).toBeUndefined();
    });

    it("hydrates both distribution-knowledge and distribution steps for several soil types", () => {
      const steps = convertSiteToCustomSteps(FRICHE_FEATURES);

      expect(steps.SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE).toEqual({
        completed: true,
        payload: {
          knowsSurfaceAreas: true,
          soilsDistribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 6000 },
        },
      });
      expect(steps.SPACES_SURFACE_AREA_DISTRIBUTION).toEqual({
        completed: true,
        payload: { distribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 6000 } },
      });
    });
  });

  describe("getFirstCustomStepForNature", () => {
    it("returns FRICHE_ACTIVITY for FRICHE", () => {
      expect(getFirstCustomStepForNature("FRICHE")).toBe("FRICHE_ACTIVITY");
    });

    it("returns AGRICULTURAL_OPERATION_ACTIVITY for AGRICULTURAL_OPERATION", () => {
      expect(getFirstCustomStepForNature("AGRICULTURAL_OPERATION")).toBe(
        "AGRICULTURAL_OPERATION_ACTIVITY",
      );
    });

    it("returns NATURAL_AREA_TYPE for NATURAL_AREA", () => {
      expect(getFirstCustomStepForNature("NATURAL_AREA")).toBe("NATURAL_AREA_TYPE");
    });
  });

  describe("branch reconstruction via computeStepsSequence", () => {
    it("walks the friche sequence through the contamination/accidents block", () => {
      const steps = convertSiteToCustomSteps(FRICHE_FEATURES);
      const siteData = deriveSiteDataFromCustomSteps(
        {
          id: FRICHE_FEATURES.id,
          isFriche: true,
          nature: "FRICHE",
          soils: [],
          yearlyExpenses: [],
          yearlyIncomes: [],
        },
        steps,
      );

      const sequence = computeStepsSequence(
        { context: { siteData }, answers: steps },
        "FRICHE_ACTIVITY",
        customStepHandlerRegistry,
      );

      expect(sequence).toContain("SOILS_CONTAMINATION");
      expect(sequence).toContain("FRICHE_ACCIDENTS");
      expect(sequence).toContain("TENANT");
      expect(sequence.at(-1)).toBe("FINAL_SUMMARY");
    });

    it("walks the operated agricultural sequence through IS_SITE_OPERATED and YEARLY_INCOME", () => {
      const steps = convertSiteToCustomSteps(AGRICULTURAL_FEATURES);
      const siteData = deriveSiteDataFromCustomSteps(
        {
          id: AGRICULTURAL_FEATURES.id,
          isFriche: false,
          nature: "AGRICULTURAL_OPERATION",
          soils: [],
          yearlyExpenses: [],
          yearlyIncomes: [],
        },
        steps,
      );

      const sequence = computeStepsSequence(
        { context: { siteData }, answers: steps },
        "AGRICULTURAL_OPERATION_ACTIVITY",
        customStepHandlerRegistry,
      );

      expect(sequence).toContain("IS_SITE_OPERATED");
      expect(sequence).toContain("OPERATOR");
      expect(sequence).toContain("YEARLY_INCOME");
      expect(sequence.at(-1)).toBe("FINAL_SUMMARY");
    });

    it("walks the natural area sequence straight from OWNER to NAMING_INTRODUCTION with no expenses steps", () => {
      const steps = convertSiteToCustomSteps(NATURAL_AREA_FEATURES);
      const siteData = deriveSiteDataFromCustomSteps(
        {
          id: NATURAL_AREA_FEATURES.id,
          isFriche: false,
          nature: "NATURAL_AREA",
          soils: [],
          yearlyExpenses: [],
          yearlyIncomes: [],
        },
        steps,
      );

      const sequence = computeStepsSequence(
        { context: { siteData }, answers: steps },
        "NATURAL_AREA_TYPE",
        customStepHandlerRegistry,
      );

      expect(sequence).toContain("NAMING_INTRODUCTION");
      expect(sequence).not.toContain("YEARLY_EXPENSES");
      expect(sequence).not.toContain("YEARLY_INCOME");
      expect(sequence).not.toContain("SOILS_CONTAMINATION");
      expect(sequence.at(-1)).toBe("FINAL_SUMMARY");
    });
  });

  describe("round-trip invariant", () => {
    it("reproduces the saved friche site's fields through deriveSiteDataFromCustomSteps", () => {
      const steps = convertSiteToCustomSteps(FRICHE_FEATURES);
      const initialSiteData: SiteCreationData = {
        id: FRICHE_FEATURES.id,
        isFriche: true,
        nature: "FRICHE",
        soils: [],
        yearlyExpenses: [],
        yearlyIncomes: [],
      };

      const roundTripped = deriveSiteDataFromCustomSteps(initialSiteData, steps);

      expect(roundTripped.name).toBe(FRICHE_FEATURES.name);
      expect(roundTripped.description).toBe(FRICHE_FEATURES.description);
      expect(roundTripped.address).toEqual(FRICHE_FEATURES.address);
      expect(roundTripped.surfaceArea).toBe(FRICHE_FEATURES.surfaceArea);
      expect(roundTripped.soilsDistribution).toEqual(FRICHE_FEATURES.soilsDistribution);
      expect(roundTripped.owner).toEqual({ structureType: "company", name: "Owner Corp" });
      expect(roundTripped.tenant).toEqual({
        structureType: "private_individual",
        name: "Tenant Name",
      });
      expect(roundTripped.yearlyExpenses).toEqual([
        { amount: 3000, purpose: "security", bearer: "tenant" },
      ]);
      expect(roundTripped.yearlyIncomes).toEqual([]);
      expect(roundTripped.fricheActivity).toBe("INDUSTRY");
      expect(roundTripped.hasContaminatedSoils).toBe(true);
      expect(roundTripped.contaminatedSoilSurface).toBe(2000);
    });
  });
});
