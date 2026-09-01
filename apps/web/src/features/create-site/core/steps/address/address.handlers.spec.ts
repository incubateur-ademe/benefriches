import { Address } from "shared";
import { describe, expect, it } from "vitest";

import type { CustomStepsState } from "../../custom/customSteps";
import type { CustomStepHandlerContext } from "../../custom/stepHandlerRegistry";
import { addressHandlers } from "./address.handlers";

const BLAJAN: Address = {
  banId: "31070_p4ur8e",
  value: "Sendere 31350 Blajan",
  city: "Blajan",
  cityCode: "31070",
  postCode: "31350",
  streetName: "Sendere",
  long: 0.664699,
  lat: 43.260859,
};

// Different city than BLAJAN.
const GRENOBLE: Address = {
  banId: "38185_0490",
  value: "Rue de Bonne 38000 Grenoble",
  city: "Grenoble",
  cityCode: "38185",
  postCode: "38000",
  streetName: "Rue de Bonne",
  long: 5.724524,
  lat: 45.188529,
};

// Same city as BLAJAN, different street/banId — re-validating the same city.
const BLAJAN_OTHER_STREET: Address = {
  ...BLAJAN,
  banId: "31070_other",
  streetName: "Autre rue",
  value: "Autre rue 31350 Blajan",
};

const context: CustomStepHandlerContext = {
  siteData: { id: "site-1", soils: [], yearlyExpenses: [], yearlyIncomes: [] },
};

const withPreviousAddress = (address: Address): CustomStepsState => ({
  ADDRESS: { completed: true, payload: { address } },
});

describe("addressHandlers.ADDRESS.getDependencyRules", () => {
  it("invalidates a completed local-authority OWNER when the city changes", () => {
    const answers: CustomStepsState = {
      ...withPreviousAddress(BLAJAN),
      OWNER: {
        completed: true,
        payload: { owner: { structureType: "municipality", name: "Mairie de Blajan" } },
      },
    };

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: GRENOBLE },
    );

    expect(rules).toEqual([{ stepId: "OWNER", action: "invalidate" }]);
  });

  it("triggers no cascade when the new address keeps the same city", () => {
    const answers: CustomStepsState = {
      ...withPreviousAddress(BLAJAN),
      OWNER: {
        completed: true,
        payload: { owner: { structureType: "municipality", name: "Mairie de Blajan" } },
      },
    };

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: BLAJAN_OTHER_STREET },
    );

    expect(rules).toEqual([]);
  });

  it("does not invalidate a company OWNER, which is not derived from the municipality", () => {
    const answers: CustomStepsState = {
      ...withPreviousAddress(BLAJAN),
      OWNER: {
        completed: true,
        payload: { owner: { structureType: "company", name: "Acme SAS" } },
      },
    };

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: GRENOBLE },
    );

    expect(rules).toEqual([]);
  });

  it("emits no rule when no stakeholder step has been completed yet", () => {
    const answers: CustomStepsState = withPreviousAddress(BLAJAN);

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: GRENOBLE },
    );

    expect(rules).toEqual([]);
  });

  it("invalidates a completed local-authority TENANT when the city changes", () => {
    const answers: CustomStepsState = {
      ...withPreviousAddress(BLAJAN),
      TENANT: {
        completed: true,
        payload: { tenant: { structureType: "municipality", name: "Mairie de Blajan" } },
      },
    };

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: GRENOBLE },
    );

    expect(rules).toEqual([{ stepId: "TENANT", action: "invalidate" }]);
  });

  it("invalidates a completed local-authority OPERATOR when the city changes", () => {
    const answers: CustomStepsState = {
      ...withPreviousAddress(BLAJAN),
      OPERATOR: {
        completed: true,
        payload: { tenant: { structureType: "municipality", name: "Mairie de Blajan" } },
      },
    };

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: GRENOBLE },
    );

    expect(rules).toEqual([{ stepId: "OPERATOR", action: "invalidate" }]);
  });

  it("invalidates both OWNER and TENANT when both are completed local authorities", () => {
    const answers: CustomStepsState = {
      ...withPreviousAddress(BLAJAN),
      OWNER: {
        completed: true,
        payload: { owner: { structureType: "municipality", name: "Mairie de Blajan" } },
      },
      TENANT: {
        completed: true,
        payload: { tenant: { structureType: "department", name: "Département de Blajan" } },
      },
    };

    const rules = addressHandlers.ADDRESS.getDependencyRules(
      { context, answers },
      { address: GRENOBLE },
    );

    expect(rules).toEqual([
      { stepId: "OWNER", action: "invalidate" },
      { stepId: "TENANT", action: "invalidate" },
    ]);
  });
});
