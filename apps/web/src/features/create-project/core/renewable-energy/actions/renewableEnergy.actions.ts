import { createAction } from "@reduxjs/toolkit";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";

import { makeProjectCreationActionType } from "../../actions/actionsUtils";

const RENEWABLE_ENERGY = "renewableEnergy";

const makeRenewableEnergyProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`${RENEWABLE_ENERGY}/${actionName}`);
};

const createRenewableEnergyAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeRenewableEnergyProjectCreationActionType(actionName));

export const customCreateModeSelected = createRenewableEnergyAction("customCreateModeSelected");

export const renewableEnergyTypeCompleted =
  createRenewableEnergyAction<RenewableEnergyDevelopmentPlanType>("renewableEnergyTypeCompleted");
