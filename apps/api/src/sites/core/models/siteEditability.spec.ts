import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getSiteEditability } from "./siteEditability";

describe("getSiteEditability", () => {
  it("reports editable when the requester created a custom site with no active reconversion project", () => {
    const userId = "4550d9f0-ce28-43ae-a319-94851ae033db";
    const site = {
      createdBy: userId,
      creationMode: "custom" as const,
      hasActiveReconversionProject: false,
    };

    const result = getSiteEditability(site, userId);

    assert.deepStrictEqual(result, { isEditable: true, notEditableReason: null });
  });

  it("reports NOT_CREATOR when the requester did not create the site", () => {
    const site = {
      createdBy: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
      creationMode: "custom" as const,
      hasActiveReconversionProject: false,
    };

    const result = getSiteEditability(site, "0918223a-4d05-43a3-ad15-ccac704f7998");

    assert.deepStrictEqual(result, { isEditable: false, notEditableReason: "NOT_CREATOR" });
  });

  for (const creationMode of ["express", "csv-import"] as const) {
    it(`reports NOT_CUSTOM when the site's creation mode is ${creationMode}`, () => {
      const userId = "4550d9f0-ce28-43ae-a319-94851ae033db";
      const site = {
        createdBy: userId,
        creationMode,
        hasActiveReconversionProject: false,
      };

      const result = getSiteEditability(site, userId);

      assert.deepStrictEqual(result, { isEditable: false, notEditableReason: "NOT_CUSTOM" });
    });
  }

  it("reports ACTIVE_RECONVERSION_PROJECT when a custom site the requester created has an active project", () => {
    const userId = "4550d9f0-ce28-43ae-a319-94851ae033db";
    const site = {
      createdBy: userId,
      creationMode: "custom" as const,
      hasActiveReconversionProject: true,
    };

    const result = getSiteEditability(site, userId);

    assert.deepStrictEqual(result, {
      isEditable: false,
      notEditableReason: "ACTIVE_RECONVERSION_PROJECT",
    });
  });

  it("reports NOT_CREATOR rather than NOT_CUSTOM when several conditions fail at once", () => {
    const site = {
      createdBy: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
      creationMode: "express" as const,
      hasActiveReconversionProject: true,
    };

    const result = getSiteEditability(site, "0918223a-4d05-43a3-ad15-ccac704f7998");

    assert.strictEqual(result.notEditableReason, "NOT_CREATOR");
  });
});
