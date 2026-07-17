import { describe, it, expect } from "vitest";

import { WizardFormState } from "../../urbanProjectForm.state";
import {
  isSiteResalePlannedAfterDevelopment,
  shouldSiteResalePriceBeEstimated,
} from "./siteResaleReaders";

describe("siteResaleReaders", () => {
  describe("isSiteResalePlannedAfterDevelopment", () => {
    it("should return true when siteResaleSelection is 'yes'", () => {
      const steps: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      expect(isSiteResalePlannedAfterDevelopment(steps)).toBe(true);
    });

    it("should return true when siteResaleSelection is 'unknown'", () => {
      const steps: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      expect(isSiteResalePlannedAfterDevelopment(steps)).toBe(true);
    });

    it("should return false when siteResaleSelection is 'no'", () => {
      const steps: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      expect(isSiteResalePlannedAfterDevelopment(steps)).toBe(false);
    });
  });

  describe("shouldSiteResalePriceBeEstimated", () => {
    it("should return true when siteResaleSelection is 'unknown'", () => {
      const steps: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      expect(shouldSiteResalePriceBeEstimated(steps)).toBe(true);
    });

    it("should return false when siteResaleSelection is 'yes'", () => {
      const steps: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      expect(shouldSiteResalePriceBeEstimated(steps)).toBe(false);
    });
  });
});
