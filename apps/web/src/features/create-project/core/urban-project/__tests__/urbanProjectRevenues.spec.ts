import { stepRevertAttempted } from "../../actions/actionsUtils";
import {
  buildingsResaleRevenueCompleted,
  expectedSiteResaleRevenueCompleted,
  financialAssistanceRevenuesCompleted,
  revenueIntroductionCompleted,
  yearlyBuildingsOperationsRevenuesCompleted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : revenues steps", () => {
  describe("Custom creation mode", () => {
    describe("URBAN_PROJECT_REVENUE_INTRODUCTION step", () => {
      it("goes to URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE step when step is completed and site will be sold after development", () => {
        const store = new StoreBuilder()
          .withCreationData({ siteResalePlannedAfterDevelopment: true })
          .withStepsHistory(["URBAN_PROJECT_REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
        });
      });

      it("goes to URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE step when step is completed, site will be sold after development and there are no buildings", () => {
        const store = new StoreBuilder()
          .withCreationData({ siteResalePlannedAfterDevelopment: false })
          .withStepsHistory(["URBAN_PROJECT_REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
        });
      });

      it("goes to URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES step when step is completed, site and buildings will not be sold after development", () => {
        const store = new StoreBuilder()
          .withCreationData({
            siteResalePlannedAfterDevelopment: false,
            buildingsResalePlannedAfterDevelopment: false,
            livingAndActivitySpacesDistribution: { BUILDINGS: 12400 },
          })
          .withStepsHistory(["URBAN_PROJECT_REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
        });
      });

      it("goes to URBAN_PROJECT_REVENUE_BUILDINGS_RESALE step when step is completed, site will not be sold but buildings will", () => {
        const store = new StoreBuilder()
          .withCreationData({
            siteResalePlannedAfterDevelopment: false,
            buildingsResalePlannedAfterDevelopment: true,
            livingAndActivitySpacesDistribution: { BUILDINGS: 12400 },
          })
          .withStepsHistory(["URBAN_PROJECT_REVENUE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(revenueIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_EXPENSES_INSTALLATION",
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
          ])
          .build();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectCurrentStep(newState, "URBAN_PROJECT_EXPENSES_INSTALLATION");
      });
    });
    describe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE step", () => {
      it("goes to URBAN_PROJECT_REVENUE_BUILDINGS_RESALE step and sets siteResaleExpectedSellingPrice and siteResaleExpectedPropertyTransferDuties when step is completed and buildings resale planned", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          ])
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
          currentStep: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          creationDataDiff: {
            siteResaleExpectedSellingPrice: 500000,
            siteResaleExpectedPropertyTransferDuties: 25000,
          },
        });
      });
      it("goes to URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES step and sets siteResaleExpectedSellingPrice and siteResaleExpectedPropertyTransferDuties when step is completed and buildings will not be sold", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          ])
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
          currentStep: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          creationDataDiff: {
            siteResaleExpectedSellingPrice: 500000,
            siteResaleExpectedPropertyTransferDuties: 25000,
          },
        });
      });
      it("goes to previous step and unset siteResaleExpectedSellingPrice and siteResaleExpectedPropertyTransferDuties when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          ])
          .withCreationData({
            siteResaleExpectedSellingPrice: 500000,
            siteResaleExpectedPropertyTransferDuties: 25000,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            siteResaleExpectedSellingPrice: undefined,
            siteResaleExpectedPropertyTransferDuties: undefined,
          },
        });
      });
    });
    describe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE step", () => {
      it("goes to URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE step and sets buildingsResaleExpectedSellingPrice and buildingsResaleExpectedPropertyTransferDuties when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          ])
          .withCreationData({
            livingAndActivitySpacesDistribution: { BUILDINGS: 5000 },
            buildingsResalePlannedAfterDevelopment: true,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          buildingsResaleRevenueCompleted({
            sellingPrice: 135999,
            propertyTransferDuties: 999,
          }),
        );
        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          creationDataDiff: {
            buildingsResaleSellingPrice: 135999,
            buildingsResalePropertyTransferDuties: 999,
          },
        });
      });
      it("goes to previous step and unset buildingsResaleExpectedSellingPrice and buildingsResaleExpectedPropertyTransferDuties when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          ])
          .withCreationData({
            buildingsResaleSellingPrice: 135999,
            buildingsResalePropertyTransferDuties: 999,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            buildingsResaleSellingPrice: undefined,
            buildingsResalePropertyTransferDuties: undefined,
          },
        });
      });
    });
    describe("REVENUE_PROJECTED_YEARLY_REVENUE step", () => {
      it("goes to URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE step and sets yearlyProjectedRevenues when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          yearlyBuildingsOperationsRevenuesCompleted([{ amount: 1000, source: "rent" }]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          creationDataDiff: {
            yearlyProjectedRevenues: [{ amount: 1000, source: "rent" }],
          },
        });
      });
      it("goes to previous step and unset yearlyProjectedRevenues when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_INTRODUCTION",
            "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          ])
          .withCreationData({
            yearlyProjectedRevenues: [{ amount: 1000, source: "other" }],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            yearlyProjectedRevenues: undefined,
          },
        });
      });
    });
    describe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE step", () => {
      it("goes to URBAN_PROJECT_SCHEDULE_INTRODUCTION and sets financialAssistanceRevenues when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
            "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
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
          currentStep: "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
          creationDataDiff: {
            financialAssistanceRevenues: [
              { source: "local_or_regional_authority_participation", amount: 1000 },
            ],
          },
        });
      });
      it("goes to previous step and unset financialAssistanceRevenues when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
            "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          ])
          .withCreationData({
            financialAssistanceRevenues: [
              { source: "local_or_regional_authority_participation", amount: 1000 },
            ],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

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
