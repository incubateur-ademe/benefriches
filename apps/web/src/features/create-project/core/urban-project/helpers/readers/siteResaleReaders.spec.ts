import { describe, it, expect } from "vitest";

import type { UrbanProjectStepsState } from "../../urbanProject.state";
import {
  isSiteResalePlannedAfterDevelopment,
  shouldPrefillSiteResalePrice,
} from "./siteResaleReaders";

describe("siteResaleReaders", () => {
  describe("isSiteResalePlannedAfterDevelopment", () => {
    it("should return true when siteResaleSelection is 'yes'", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      expect(isSiteResalePlannedAfterDevelopment(steps)).toBe(true);
    });

    it("should return true when siteResaleSelection is 'unknown'", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      expect(isSiteResalePlannedAfterDevelopment(steps)).toBe(true);
    });

    it("should return false when siteResaleSelection is 'no'", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      expect(isSiteResalePlannedAfterDevelopment(steps)).toBe(false);
    });
  });

  describe("shouldPrefillSiteResalePrice", () => {
    it("should return true when siteResaleSelection is 'unknown'", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      expect(shouldPrefillSiteResalePrice(steps)).toBe(true);
    });

    it("should return false when siteResaleSelection is 'yes'", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      expect(shouldPrefillSiteResalePrice(steps)).toBe(false);
    });
  });
});
