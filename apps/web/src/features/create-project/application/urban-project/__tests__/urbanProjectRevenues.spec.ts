/* eslint-disable jest/expect-expect */
import {
  expensesIntroductionReverted,
  financialAssistanceRevenuesCompleted,
  financialAssistanceRevenuesReverted,
  revenueIntroductionCompleted,
  yearlyProjectedRevenueCompleted,
  yearlyProjectedRevenueReverted,
} from "../urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : revenues steps", () => {
  describe("Custom creation mode", () => {
    describe("REVENUE_INTRODUCTION step", () => {
      it("goes to REVENUE_PROJECTED_YEARLY_REVENUE step when step is completed if project has buildings", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_INTRODUCTION"])
          .withCreationData({ livingAndActivitySpacesDistribution: { BUILDINGS: 1000 } })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_PROJECTED_YEARLY_REVENUE",
        });
      });

      it("goes to REVENUE_FINANCIAL_ASSISTANCE step when step is completed if project has no buildings", () => {
        const store = new StoreBuilder().withStepsHistory(["REVENUE_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_FINANCIAL_ASSISTANCE",
        });
      });

      it("goes to EXPENSES_PROJECTED_YEARLY_EXPENSES step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_PROJECTED_YEARLY_EXPENSES", "REVENUE_INTRODUCTION"])
          .build();

        store.dispatch(expensesIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "EXPENSES_PROJECTED_YEARLY_EXPENSES");
      });
    });
    describe("REVENUE_PROJECTED_YEARLY_REVENUE step", () => {
      it("goes to REVENUE_FINANCIAL_ASSISTANCE step and sets yearlyProjectedRevenues when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_INTRODUCTION", "REVENUE_PROJECTED_YEARLY_REVENUE"])
          .withSiteData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(yearlyProjectedRevenueCompleted([{ amount: 1000, source: "operations" }]));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_FINANCIAL_ASSISTANCE",
          creationDataDiff: {
            yearlyProjectedRevenues: [{ amount: 1000, source: "operations" }],
          },
        });
      });
      it("goes to previous step and unset yearlyProjectedRevenues when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_INTRODUCTION", "REVENUE_PROJECTED_YEARLY_REVENUE"])
          .withCreationData({
            yearlyProjectedRevenues: [{ amount: 1000, source: "operations" }],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(yearlyProjectedRevenueReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            yearlyProjectedRevenues: undefined,
          },
        });
      });
    });
    describe("REVENUE_FINANCIAL_ASSISTANCE step", () => {
      it("goes to SCHEDULE_INTRODUCTION and sets financialAssistanceRevenues when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_PROJECTED_YEARLY_REVENUE", "REVENUE_FINANCIAL_ASSISTANCE"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          financialAssistanceRevenuesCompleted([
            { source: "local_or_regional_authority_participation", amount: 1000 },
          ]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SCHEDULE_INTRODUCTION",
          creationDataDiff: {
            financialAssistanceRevenues: [
              { source: "local_or_regional_authority_participation", amount: 1000 },
            ],
          },
        });
      });
      it("goes to previous step and unset financialAssistanceRevenues when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_SITE_PURCHASE_AMOUNTS", "EXPENSES_REINSTATEMENT"])
          .withCreationData({
            financialAssistanceRevenues: [
              { source: "local_or_regional_authority_participation", amount: 1000 },
            ],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(financialAssistanceRevenuesReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            financialAssistanceRevenues: undefined,
          },
        });
      });
    });
  });
});
