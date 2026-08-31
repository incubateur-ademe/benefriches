import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

const OWNER = { structureType: "company" as const, name: "SAS Owner" };
const TENANT = { structureType: "company" as const, name: "Tenant SARL" };

describe("Site creation: site management steps", () => {
  describe("OWNER", () => {
    it.each([
      ["FRICHE", "IS_FRICHE_LEASED"],
      ["AGRICULTURAL_OPERATION", "IS_SITE_OPERATED"],
      ["NATURAL_AREA", "NAMING_INTRODUCTION"],
    ] as const)("branches to %s -> %s", (nature, nextStep) => {
      const store = new StoreBuilder().withNature(nature).withCustomStep("OWNER").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({ stepId: "OWNER", answers: { owner: OWNER } }),
      );

      expectCurrentStep(store, nextStep);
      expect(store.getState().siteCreation.custom.steps.OWNER?.payload).toEqual({ owner: OWNER });
    });
  });

  describe("IS_FRICHE_LEASED", () => {
    it("goes to TENANT when leased", () => {
      const store = new StoreBuilder().withCustomStep("IS_FRICHE_LEASED").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "IS_FRICHE_LEASED",
          answers: { isFricheLeased: true },
        }),
      );

      expectCurrentStep(store, "TENANT");
    });

    it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION when not leased", () => {
      const store = new StoreBuilder().withCustomStep("IS_FRICHE_LEASED").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "IS_FRICHE_LEASED",
          answers: { isFricheLeased: false },
        }),
      );

      expectCurrentStep(store, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    });
  });

  describe("IS_SITE_OPERATED", () => {
    it("goes to OPERATOR when operated", () => {
      const store = new StoreBuilder().withCustomStep("IS_SITE_OPERATED").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "IS_SITE_OPERATED",
          answers: { isSiteOperated: true },
        }),
      );

      expectCurrentStep(store, "OPERATOR");
    });

    it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION when not operated", () => {
      const store = new StoreBuilder().withCustomStep("IS_SITE_OPERATED").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "IS_SITE_OPERATED",
          answers: { isSiteOperated: false },
        }),
      );

      expectCurrentStep(store, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    });
  });

  it("TENANT: stores the tenant and goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION", () => {
    const store = new StoreBuilder().withCustomStep("TENANT").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({ stepId: "TENANT", answers: { tenant: TENANT } }),
    );

    expectCurrentStep(store, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    expect(store.getState().siteCreation.custom.steps.TENANT?.payload).toEqual({ tenant: TENANT });
  });

  it("OPERATOR: stores the tenant and goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION", () => {
    const store = new StoreBuilder().withCustomStep("OPERATOR").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "OPERATOR",
        answers: { tenant: TENANT },
      }),
    );

    expectCurrentStep(store, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    expect(store.getState().siteCreation.custom.steps.OPERATOR?.payload).toEqual({
      tenant: TENANT,
    });
  });

  describe("YEARLY_EXPENSES", () => {
    it("goes to YEARLY_INCOME when the site is operated", () => {
      const store = new StoreBuilder()
        .withCustomStep("YEARLY_EXPENSES", {
          IS_SITE_OPERATED: { completed: true, payload: { isSiteOperated: true } },
        })
        .build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "YEARLY_EXPENSES",
          answers: [{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }],
        }),
      );

      expectCurrentStep(store, "YEARLY_INCOME");
    });

    it("goes straight to YEARLY_EXPENSES_SUMMARY when the site is not operated", () => {
      const store = new StoreBuilder().withCustomStep("YEARLY_EXPENSES").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "YEARLY_EXPENSES",
          answers: [{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }],
        }),
      );

      expectCurrentStep(store, "YEARLY_EXPENSES_SUMMARY");
    });
  });

  it("YEARLY_INCOME: goes to YEARLY_EXPENSES_SUMMARY", () => {
    const store = new StoreBuilder().withCustomStep("YEARLY_INCOME").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "YEARLY_INCOME",
        answers: [{ source: "operations", amount: 150000 }],
      }),
    );

    expectCurrentStep(store, "YEARLY_EXPENSES_SUMMARY");
  });
});
