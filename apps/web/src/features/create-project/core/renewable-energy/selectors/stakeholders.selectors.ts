import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
  hasStakeholder,
} from "@/features/create-project/core/project-form/stakeholders";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import type { ProjectStakeholder } from "../../project.types";
import { ReadStateHelper } from "../helpers/readState";

export const createSelectRenewableEnergyProjectAvailableStakeholders = (
  selectProjectAvailableStakeholders: Selector<RootState, AvailableProjectStakeholder[]>,
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(
    [selectProjectAvailableStakeholders, selectSteps],
    (projectAvailableStakeholders, steps) => {
      const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders;

      const projectDeveloper = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
      )?.projectDeveloper;
      if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
        stakeholders.push({
          name: projectDeveloper.name,
          role: "project_stakeholder",
          structureType: projectDeveloper.structureType,
        });
      }

      const futureOperator = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
      )?.futureOperator;
      if (futureOperator && !hasStakeholder(futureOperator, stakeholders)) {
        stakeholders.push({
          name: futureOperator.name,
          role: "project_stakeholder",
          structureType: futureOperator.structureType,
        });
      }

      const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      )?.reinstatementContractOwner;
      if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
        stakeholders.push({
          name: reinstatementContractOwner.name,
          role: "project_stakeholder",
          structureType: reinstatementContractOwner.structureType,
        });
      }

      const futureSiteOwner = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
      )?.futureSiteOwner;
      if (futureSiteOwner && !hasStakeholder(futureSiteOwner, stakeholders)) {
        stakeholders.push({
          name: futureSiteOwner.name,
          role: "project_stakeholder",
          structureType: futureSiteOwner.structureType,
        });
      }

      return stakeholders;
    },
  );

export const createSelectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders = (
  selectAvailableLocalAuthoritiesStakeholders: Selector<
    RootState,
    AvailableLocalAuthorityStakeholder[]
  >,
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(
    [selectAvailableLocalAuthoritiesStakeholders, selectSteps],
    (availableLocalAuthoritiesStakeholders, steps) => {
      const projectDeveloper = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
      )?.projectDeveloper;
      const futureOperator = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
      )?.futureOperator;
      const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      )?.reinstatementContractOwner;
      const futureSiteOwner = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
      )?.futureSiteOwner;

      const projectLocalAuthorities = [
        projectDeveloper,
        futureOperator,
        reinstatementContractOwner,
        futureSiteOwner,
      ].filter(
        (element) =>
          element &&
          ["municipality", "epci", "department", "region"].includes(element.structureType),
      ) as ProjectStakeholder[];

      const currentLocalAuthorities = projectLocalAuthorities.map((element) => ({
        type: element.structureType,
        name: element.name,
      }));

      return availableLocalAuthoritiesStakeholders.filter(
        (addressLocalAuthority) =>
          !currentLocalAuthorities.some(
            (currentLocalAuthority) =>
              currentLocalAuthority.type === addressLocalAuthority.type &&
              currentLocalAuthority.name === addressLocalAuthority.name,
          ),
      );
    },
  );
