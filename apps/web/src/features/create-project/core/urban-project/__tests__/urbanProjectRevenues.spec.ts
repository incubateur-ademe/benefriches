import {
  expectedSiteResaleRevenueCompleted,
  expectedSiteResaleRevenueReverted,
  expensesIntroductionReverted,
  financialAssistanceRevenuesCompleted,
  financialAssistanceRevenuesReverted,
  revenueIntroductionCompleted,
  yearlyBuildingsOperationsRevenuesCompleted,
  yearlyBuildingsOperationsRevenuesReverted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : revenues steps", () => {
  describe("Custom creation mode", () => {
    describe("REVENUE_INTRODUCTION step", () => {
      it("goes to REVENUE_EXPECTED_SITE_RESALE step when step is completed and site will be sold after development", () => {
        const store = new StoreBuilder()
          .withCreationData({ siteResalePlannedAfterDevelopment: true })
          .withStepsHistory(["REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_EXPECTED_SITE_RESALE",
        });
      });

      it("goes to REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES step when step is completed, site and buildings will not be sold after development", () => {
        const store = new StoreBuilder()
          .withCreationData({
            siteResalePlannedAfterDevelopment: false,
            buildingsResalePlannedAfterDevelopment: false,
            livingAndActivitySpacesDistribution: { BUILDINGS: 12400 },
          })
          .withStepsHistory(["REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
        });
      });

      it("goes to REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES step when step is completed, site will be not be sold but buildings will", () => {
        const store = new StoreBuilder()
          .withCreationData({
            siteResalePlannedAfterDevelopment: false,
            buildingsResalePlannedAfterDevelopment: true,
            livingAndActivitySpacesDistribution: { BUILDINGS: 12400 },
          })
          .withStepsHistory(["REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_FINANCIAL_ASSISTANCE",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["EXPENSES_INSTALLATION", "REVENUE_INTRODUCTION"])
          .build();

        store.dispatch(expensesIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "EXPENSES_INSTALLATION");
      });
    });
    describe("REVENUE_EXPECTED_SITE_RESALE step", () => {
      it("goes to REVENUE_FINANCIAL_ASSISTANCE step and sets siteResaleExpectedSellingPrice and siteResaleExpectedPropertyTransferDuties when step is completed and buildings resale planned", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_INTRODUCTION", "REVENUE_EXPECTED_SITE_RESALE"])
          .withCreationData({
            livingAndActivitySpacesDistribution: { BUILDINGS: 5000 },
            buildingsResalePlannedAfterDevelopment: true,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          expectedSiteResaleRevenueCompleted({
            sellingPrice: 500000,
            propertyTransferDuties: 25000,
          }),
        );
        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_FINANCIAL_ASSISTANCE",
          creationDataDiff: {
            siteResaleExpectedSellingPrice: 500000,
            siteResaleExpectedPropertyTransferDuties: 25000,
          },
        });
      });
      it("goes to REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES step and sets siteResaleExpectedSellingPrice and siteResaleExpectedPropertyTransferDuties when step is completed and buildings will not be sold", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_INTRODUCTION", "REVENUE_EXPECTED_SITE_RESALE"])
          .withCreationData({
            livingAndActivitySpacesDistribution: { BUILDINGS: 5000 },
            buildingsResalePlannedAfterDevelopment: false,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          expectedSiteResaleRevenueCompleted({
            sellingPrice: 500000,
            propertyTransferDuties: 25000,
          }),
        );
        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          creationDataDiff: {
            siteResaleExpectedSellingPrice: 500000,
            siteResaleExpectedPropertyTransferDuties: 25000,
          },
        });
      });
      it("goes to previous step and unset siteResaleExpectedSellingPrice and siteResaleExpectedPropertyTransferDuties when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_INTRODUCTION", "REVENUE_EXPECTED_SITE_RESALE"])
          .withCreationData({
            siteResaleExpectedSellingPrice: 500000,
            siteResaleExpectedPropertyTransferDuties: 25000,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(expectedSiteResaleRevenueReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            siteResaleExpectedSellingPrice: undefined,
            siteResaleExpectedPropertyTransferDuties: undefined,
          },
        });
      });
    });
    describe("REVENUE_PROJECTED_YEARLY_REVENUE step", () => {
      it("goes to REVENUE_FINANCIAL_ASSISTANCE step and sets yearlyProjectedRevenues when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "REVENUE_INTRODUCTION",
            "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          yearlyBuildingsOperationsRevenuesCompleted([{ amount: 1000, source: "rent" }]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "REVENUE_FINANCIAL_ASSISTANCE",
          creationDataDiff: {
            yearlyProjectedRevenues: [{ amount: 1000, source: "rent" }],
          },
        });
      });
      it("goes to previous step and unset yearlyProjectedRevenues when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "REVENUE_INTRODUCTION",
            "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          ])
          .withCreationData({
            yearlyProjectedRevenues: [{ amount: 1000, source: "other" }],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(yearlyBuildingsOperationsRevenuesReverted());

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
          .withStepsHistory([
            "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
            "REVENUE_FINANCIAL_ASSISTANCE",
          ])
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
