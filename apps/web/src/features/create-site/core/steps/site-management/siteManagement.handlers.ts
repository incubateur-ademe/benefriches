import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
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
} from "./siteManagement.actions";

export const registerSiteManagementHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(managementIntroductionCompleted, (state) => {
      state.stepsHistory.push("OWNER");
    })
    .addCase(ownerStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.owner = action.payload.owner;
      if (answeredStep) {
        state.answers[answeredStep] = { owner: action.payload.owner };
      }
      switch (state.siteData.nature) {
        case "FRICHE":
          state.stepsHistory.push("IS_FRICHE_LEASED");
          break;
        case "AGRICULTURAL_OPERATION":
          state.stepsHistory.push("IS_SITE_OPERATED");
          break;
        case "NATURAL_AREA":
          state.stepsHistory.push("NAMING_INTRODUCTION");
      }
    })
    .addCase(isFricheLeasedStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      const { isFricheLeased } = action.payload;
      state.siteData.isFricheLeased = isFricheLeased;
      if (answeredStep) {
        state.answers[answeredStep] = { isFricheLeased };
      }
      state.stepsHistory.push(
        isFricheLeased ? "TENANT" : "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
      );
    })
    .addCase(isSiteOperatedStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      const { isSiteOperated } = action.payload;
      state.siteData.isSiteOperated = isSiteOperated;
      if (answeredStep) {
        state.answers[answeredStep] = { isSiteOperated };
      }
      state.stepsHistory.push(
        isSiteOperated ? "OPERATOR" : "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
      );
    })
    .addCase(tenantStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.tenant = action.payload.tenant;
      if (answeredStep) {
        state.answers[answeredStep] = { tenant: action.payload.tenant };
      }
      state.stepsHistory.push("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    })
    .addCase(operatorStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      const { tenant } = action.payload;
      if (tenant) {
        state.siteData.tenant = tenant;
        if (answeredStep) {
          state.answers[answeredStep] = { tenant };
        }
      }
      state.stepsHistory.push("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    })
    .addCase(yearlyExpensesAndIncomeIntroductionCompleted, (state) => {
      state.stepsHistory.push("YEARLY_EXPENSES");
    })
    .addCase(yearlyExpensesStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.yearlyExpenses = action.payload;
      if (answeredStep) {
        state.answers[answeredStep] = { yearlyExpenses: action.payload };
      }
      state.stepsHistory.push(
        state.siteData.isSiteOperated ? "YEARLY_INCOME" : "YEARLY_EXPENSES_SUMMARY",
      );
    })
    .addCase(yearlyExpensesSummaryCompleted, (state) => {
      state.stepsHistory.push("NAMING_INTRODUCTION");
    })
    .addCase(yearlyIncomeStepCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.yearlyIncomes = action.payload;
      if (answeredStep) {
        state.answers[answeredStep] = { yearlyIncomes: action.payload };
      }
      state.stepsHistory.push("YEARLY_EXPENSES_SUMMARY");
    });
};

export const revertSiteManagementStep = (state: SiteCreationState): void => {
  const revertedStep = state.stepsHistory.at(-1);
  switch (revertedStep) {
    case "OWNER":
      state.siteData.owner = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "IS_FRICHE_LEASED":
      state.siteData.isFricheLeased = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "IS_SITE_OPERATED":
      state.siteData.isSiteOperated = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "TENANT":
    case "OPERATOR":
      state.siteData.tenant = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "YEARLY_EXPENSES":
      state.siteData.yearlyExpenses = [];
      state.answers[revertedStep] = undefined;
      break;
    case "YEARLY_INCOME":
      state.siteData.yearlyIncomes = [];
      state.answers[revertedStep] = undefined;
      break;
  }
};
