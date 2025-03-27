import { stepRevertAttempted } from "../../actions/revert.actions";
import {
  isFricheLeasedStepCompleted,
  isSiteOperatedStepCompleted,
  managementIntroductionCompleted,
  operatorStepCompleted,
  ownerStepCompleted,
  tenantStepCompleted,
  yearlyExpensesAndIncomeIntroductionCompleted,
  yearlyExpensesStepCompleted,
  yearlyExpensesSummaryCompleted,
  yearlyIncomeStepCompleted,
} from "../../actions/siteManagement.actions";
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

        store.dispatch(managementIntroductionCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "OWNER");
      });
    });
  });
  describe("OWNER", () => {
    describe("complete", () => {
      it("goes to IS_FRICHE_LEASED step when site is friche and sets owner when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["OWNER"])
          .withCreationData({ nature: "FRICHE" })
          .build();
        const initialRootState = store.getState();

        store.dispatch(ownerStepCompleted({ owner: siteWithExhaustiveData.owner }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
        expectNewCurrentStep(initialRootState, newState, "IS_FRICHE_LEASED");
      });
      it("goes to NAMING step when site is natural area and sets owner when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["OWNER"])
          .withCreationData({ nature: "NATURAL_AREA" })
          .build();
        const initialRootState = store.getState();

        store.dispatch(ownerStepCompleted({ owner: siteWithExhaustiveData.owner }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
        expectNewCurrentStep(initialRootState, newState, "NAMING_INTRODUCTION");
      });
      it("goes to IS_SITE_OPERATED step when site is agricultural operation and sets owner when step is completed", () => {
        const store = new StoreBuilder()
          .withCreationData({ nature: "AGRICULTURAL_OPERATION" })
          .withStepsHistory(["OWNER"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(ownerStepCompleted({ owner: siteWithExhaustiveData.owner }));

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

        store.dispatch(stepRevertAttempted());

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

        store.dispatch(isFricheLeasedStepCompleted({ isFricheLeased: true }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFricheLeased: true });
        expectNewCurrentStep(initialRootState, newState, "TENANT");
      });
      it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step when step is completed and not leased", () => {
        const store = new StoreBuilder().withStepsHistory(["IS_FRICHE_LEASED"]).build();
        const initialRootState = store.getState();

        store.dispatch(isFricheLeasedStepCompleted({ isFricheLeased: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFricheLeased: false });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
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

        store.dispatch(stepRevertAttempted());

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

        store.dispatch(isSiteOperatedStepCompleted({ isSiteOperated: true }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isSiteOperated: true });
        expectNewCurrentStep(initialRootState, newState, "OPERATOR");
      });
      it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step when step is completed and no tenant", () => {
        const store = new StoreBuilder().withStepsHistory(["IS_SITE_OPERATED"]).build();
        const initialRootState = store.getState();

        store.dispatch(isSiteOperatedStepCompleted({ isSiteOperated: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          isSiteOperated: false,
        });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
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

        store.dispatch(stepRevertAttempted());

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
      it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step and sets tenant when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["OPERATOR"]).build();
        const initialRootState = store.getState();

        store.dispatch(operatorStepCompleted({ tenant: siteWithExhaustiveData.tenant }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
      });
      it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step when step is completed with tenant", () => {
        const store = new StoreBuilder().withStepsHistory(["OPERATOR"]).build();
        const initialRootState = store.getState();

        store.dispatch(operatorStepCompleted({ tenant: undefined }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { tenant: undefined });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
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

        store.dispatch(stepRevertAttempted());

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
      describe("when site is friche", () => {
        it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step and sets tenant when step is completed", () => {
          const store = new StoreBuilder()
            .withCreationData({
              isFriche: true,
              nature: "FRICHE",
            })
            .withStepsHistory(["TENANT"])
            .build();
          const initialRootState = store.getState();

          store.dispatch(tenantStepCompleted({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
          expectNewCurrentStep(
            initialRootState,
            newState,
            "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
          );
        });
        it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step when step is completed and no tenant", () => {
          const store = new StoreBuilder()
            .withCreationData({
              isFriche: true,
              nature: "FRICHE",
            })
            .withStepsHistory(["TENANT"])
            .build();
          const initialRootState = store.getState();

          store.dispatch(tenantStepCompleted({ tenant: undefined }));

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(
            initialRootState,
            newState,
            "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
          );
        });
      });
      describe("when site is agricultural operation", () => {
        it("goes to YEARLY_EXPENSES_AND_INCOME_INTRODUCTION step and sets tenant when step is completed", () => {
          const store = new StoreBuilder()
            .withCreationData({
              isFriche: false,
              nature: "AGRICULTURAL_OPERATION",
            })
            .withStepsHistory(["TENANT"])
            .build();
          const initialRootState = store.getState();

          store.dispatch(tenantStepCompleted({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
          expectNewCurrentStep(
            initialRootState,
            newState,
            "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
          );
        });
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

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          tenant: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to YEARLY_EXPENSES step when completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["TENANT", "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(yearlyExpensesAndIncomeIntroductionCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
      });
    });
    describe("revert", () => {
      it("goes to previous step", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["TENANT", "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
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

        store.dispatch(yearlyExpensesStepCompleted(siteWithExhaustiveData.yearlyExpenses));

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

        store.dispatch(yearlyExpensesStepCompleted(siteWithExhaustiveData.yearlyExpenses));

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

        store.dispatch(stepRevertAttempted());

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

        store.dispatch(yearlyExpensesSummaryCompleted());

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

      store.dispatch(yearlyIncomeStepCompleted(siteWithExhaustiveData.yearlyIncomes));

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

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          yearlyIncomes: [],
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});
