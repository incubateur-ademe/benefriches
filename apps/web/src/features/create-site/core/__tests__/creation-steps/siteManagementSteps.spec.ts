import {
  revertIsFricheLeasedStep,
  revertIsSiteOperatedStep,
  revertOperatorStep,
  revertOwnerStep,
  revertTenantStep,
  revertYearlyExpensesStep,
  revertYearlyIncomeStep,
} from "../../actions/createSite.actions";
import {
  completeIsFricheLeased,
  completeIsSiteOperated,
  completeManagementIntroduction,
  completeOperator,
  completeOwner,
  completeTenant,
  completeYearlyExpenses,
  completeYearlyExpensesSummary,
  completeYearlyIncome,
} from "../../createSite.reducer";
import { siteWithExhaustiveData } from "../../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "./testUtils";

describe("Site creation: site management steps", () => {
  describe("MANAGEMENT_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to OWNER step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["MANAGEMENT_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeManagementIntroduction());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "OWNER");
      });
    });
  });
  describe("OWNER", () => {
    describe("complete", () => {
      it("goes to IS_FRICHE_LEASED step if site is friche and sets owner when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["OWNER"])
          .withCreationData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
        expectNewCurrentStep(initialRootState, newState, "IS_FRICHE_LEASED");
      });
      it("goes to IS_SITE_OPERATED step and sets owner when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["OWNER"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
        expectNewCurrentStep(initialRootState, newState, "IS_SITE_OPERATED");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset owner", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER"])
          .withCreationData({
            isFriche: true,
            owner: siteWithExhaustiveData.owner,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertOwnerStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { owner: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("IS_FRICHE_LEASED", () => {
    describe("complete", () => {
      it("goes to TENANT step and sets isFricheLeased when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["IS_FRICHE_LEASED"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeIsFricheLeased({ isFricheLeased: true }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFricheLeased: true });
        expectNewCurrentStep(initialRootState, newState, "TENANT");
      });
      it("goes to YEARLY_EXPENSES step when step is completed and not leased", () => {
        const store = new StoreBuilder().withStepsHistory(["IS_FRICHE_LEASED"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeIsFricheLeased({ isFricheLeased: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFricheLeased: false });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset isFricheLeased", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "IS_FRICHE_LEASED"])
          .withCreationData({
            isFriche: true,
            tenant: siteWithExhaustiveData.tenant,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertIsFricheLeasedStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          isFricheLeased: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("IS_SITE_OPERATED", () => {
    describe("complete", () => {
      it("goes to OPERATOR step and sets isSiteOperated when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["IS_SITE_OPERATED"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeIsSiteOperated({ isSiteOperated: true }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isSiteOperated: true });
        expectNewCurrentStep(initialRootState, newState, "OPERATOR");
      });
      it("goes to YEARLY_EXPENSES step when step is completed and no tenant", () => {
        const store = new StoreBuilder().withStepsHistory(["IS_SITE_OPERATED"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeIsSiteOperated({ isSiteOperated: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          isSiteOperated: false,
        });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset isSiteOperated", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "IS_SITE_OPERATED"])
          .withCreationData({
            tenant: siteWithExhaustiveData.tenant,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertIsSiteOperatedStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          isSiteOperated: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("OPERATOR", () => {
    describe("complete", () => {
      it("goes to YEARLY_EXPENSES step and sets tenant when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["OPERATOR"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeOperator({ tenant: siteWithExhaustiveData.tenant }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
      it("goes to YEARLY_EXPENSES step when step is completed with tenant", () => {
        const store = new StoreBuilder().withStepsHistory(["OPERATOR"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeOperator({ tenant: undefined }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { tenant: undefined });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset tenant", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "IS_SITE_OPERATED", "OPERATOR"])
          .withCreationData({
            tenant: siteWithExhaustiveData.tenant,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertOperatorStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          tenant: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });

  describe("TENANT", () => {
    describe("complete", () => {
      it("goes to YEARLY_EXPENSES step and sets tenant when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["TENANT"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeTenant({ tenant: siteWithExhaustiveData.tenant }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
      it("goes to YEARLY_EXPENSES step when step is completed and no tenant", () => {
        const store = new StoreBuilder().withStepsHistory(["TENANT"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeTenant({ tenant: undefined }));

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset tenant", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "TENANT"])
          .withCreationData({
            isFriche: true,
            tenant: siteWithExhaustiveData.tenant,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertTenantStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          tenant: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("YEARLY_EXPENSES", () => {
    describe("complete", () => {
      it("goes to YEARLY_EXPENSES_SUMMARY step if site is friche and sets yearly expenses when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["YEARLY_EXPENSES"])
          .withCreationData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
        });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_SUMMARY");
      });
      it("goes to YEARLY_INCOME step if site is worked and sets yearly expenses when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["YEARLY_EXPENSES"])
          .withCreationData({ isSiteOperated: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
        });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_INCOME");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset yearly expenses", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "YEARLY_EXPENSES"])
          .withCreationData({
            isFriche: true,
            yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertYearlyExpensesStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          yearlyExpenses: [],
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("YEARLY_EXPENSES_SUMMARY", () => {
    describe("complete", () => {
      it("goes to NAMING_INTRODUCTION step when step is completed and site is a friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["YEARLY_EXPENSES_SUMMARY"])
          .withCreationData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(completeYearlyExpensesSummary());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "NAMING_INTRODUCTION");
      });
    });
  });
  describe("YEARLY_INCOME", () => {
    it("goes to YEARLY_EXPENSES_SUMMARY step and sets yearly income when step is completed", () => {
      const store = new StoreBuilder().withStepsHistory(["YEARLY_INCOME"]).build();
      const initialRootState = store.getState();

      store.dispatch(completeYearlyIncome(siteWithExhaustiveData.yearlyIncomes));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, {
        yearlyIncomes: siteWithExhaustiveData.yearlyIncomes,
      });
      expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_SUMMARY");
    });
    describe("revert", () => {
      it("goes to previous step and unset yearly income", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "YEARLY_INCOME"])
          .withCreationData({
            isFriche: true,
            yearlyIncomes: siteWithExhaustiveData.yearlyIncomes,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertYearlyIncomeStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          yearlyIncomes: [],
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});
