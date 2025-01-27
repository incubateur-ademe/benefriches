import {
  expensesIntroductionCompleted,
  expensesIntroductionReverted,
  installationExpensesCompleted,
  installationExpensesReverted,
  reinstatementExpensesCompleted,
  reinstatementExpensesReverted,
  sitePurchaseCompleted,
  sitePurchaseReverted,
  yearlyProjectedExpensesCompleted,
  yearlyProjectedExpensesReverted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : costs steps", () => {
  describe("Custom creation mode", () => {
    describe("EXPENSES_INTRODUCTION step", () => {
      it("goes to EXPENSES_SITE_PURCHASE_AMOUNTS step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["EXPENSES_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(expensesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_SITE_PURCHASE_AMOUNTS",
        });
      });

      it("goes to STAKEHOLDERS_PROJECT_DEVELOPER step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["STAKEHOLDERS_PROJECT_DEVELOPER", "EXPENSES_INTRODUCTION"])
          .build();

        store.dispatch(expensesIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "STAKEHOLDERS_PROJECT_DEVELOPER");
      });
    });
    describe("EXPENSES_SITE_PURCHASE_AMOUNTS step", () => {
      it("goes to EXPENSES_REINSTATEMENT step and sets sellingPrice and propertyTransferDuties when step is completed if site is friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_INTRODUCTION", "EXPENSES_SITE_PURCHASE_AMOUNTS"])
          .withSiteData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          sitePurchaseCompleted({
            sellingPrice: 50000,
            propertyTransferDuties: 5000,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_REINSTATEMENT",
          creationDataDiff: {
            sitePurchaseSellingPrice: 50000,
            sitePurchasePropertyTransferDuties: 5000,
          },
        });
      });
      it("goes to EXPENSES_INSTALLATION step and sets sellingPrice and propertyTransferDuties when step is completed if site is not friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_INTRODUCTION", "EXPENSES_SITE_PURCHASE_AMOUNTS"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          sitePurchaseCompleted({
            sellingPrice: 50000,
            propertyTransferDuties: 5000,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_INSTALLATION",
          creationDataDiff: {
            sitePurchaseSellingPrice: 50000,
            sitePurchasePropertyTransferDuties: 5000,
          },
        });
      });
      it("goes to previous step and unset sellingPrice and propertyTransferDuties when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_INTRODUCTION", "EXPENSES_SITE_PURCHASE_AMOUNTS"])
          .withCreationData({
            sitePurchaseSellingPrice: 50000,
            sitePurchasePropertyTransferDuties: 5000,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(sitePurchaseReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            sitePurchaseSellingPrice: undefined,
            sitePurchasePropertyTransferDuties: undefined,
          },
        });
      });
    });
    describe("EXPENSES_REINSTATEMENT step", () => {
      it("goes to EXPENSES_INSTALLATION and sets reinstatementExpenses when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_SITE_PURCHASE_AMOUNTS", "EXPENSES_REINSTATEMENT"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          reinstatementExpensesCompleted([{ purpose: "asbestos_removal", amount: 1000 }]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_INSTALLATION",
          creationDataDiff: {
            reinstatementExpenses: [{ purpose: "asbestos_removal", amount: 1000 }],
          },
        });
      });
      it("goes to previous step and unset reinstatementExpenses when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_SITE_PURCHASE_AMOUNTS", "EXPENSES_REINSTATEMENT"])
          .withCreationData({
            reinstatementExpenses: [{ purpose: "asbestos_removal", amount: 1000 }],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(reinstatementExpensesReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            reinstatementExpenses: undefined,
          },
        });
      });
    });
    describe("EXPENSES_INSTALLATION step", () => {
      it("goes to EXPENSES_PROJECTED_YEARLY_EXPENSES when step is completed and project has buildings", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_SITE_PURCHASE_AMOUNTS", "EXPENSES_INSTALLATION"])
          .withCreationData({
            livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
            projectDevoloperOwnsBuildings: true,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          installationExpensesCompleted([{ amount: 10000, purpose: "development_works" }]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_PROJECTED_YEARLY_EXPENSES",
          creationDataDiff: {
            installationExpenses: [{ amount: 10000, purpose: "development_works" }],
          },
        });
      });
      it("goes to REVENUE_INTRODUCTION when step is completed and project has no buildings", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_SITE_PURCHASE_AMOUNTS", "EXPENSES_INSTALLATION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          installationExpensesCompleted([{ amount: 10000, purpose: "development_works" }]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_INTRODUCTION",
          creationDataDiff: {
            installationExpenses: [{ amount: 10000, purpose: "development_works" }],
          },
        });
      });
      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_SITE_PURCHASE_AMOUNTS", "EXPENSES_INSTALLATION"])

          .withCreationData({
            installationExpenses: [{ amount: 10000, purpose: "development_works" }],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(installationExpensesReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            installationExpenses: undefined,
          },
        });
      });
    });
    describe("EXPENSES_PROJECTED_YEARLY_EXPENSES step", () => {
      it("goes to REVENUE_INTRODUCTION when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_PROJECTED_YEARLY_EXPENSES"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          yearlyProjectedExpensesCompleted([{ amount: 1000, purpose: "maintenance" }]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_INTRODUCTION",
          creationDataDiff: {
            yearlyProjectedExpenses: [{ amount: 1000, purpose: "maintenance" }],
          },
        });
      });
      it("goes to previous step and set yearlyProjectedExpenses to undefined when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_INSTALLATION", "EXPENSES_PROJECTED_YEARLY_EXPENSES"])
          .withCreationData({
            yearlyProjectedExpenses: [{ amount: 1000, purpose: "maintenance" }],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(yearlyProjectedExpensesReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            yearlyProjectedExpenses: undefined,
          },
        });
      });
    });
  });
});
