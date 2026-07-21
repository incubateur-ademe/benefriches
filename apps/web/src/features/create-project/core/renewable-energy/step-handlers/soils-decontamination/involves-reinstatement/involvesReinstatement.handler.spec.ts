import { describe, expect, it } from "vitest";

import type { RenewableEnergyStepsState } from "../../stepHandler.type";
import { InvolvesReinstatementHandler } from "./involvesReinstatement.handler";

const CONTEXT = { siteData: undefined };

const REINSTATEMENT_STEPS: RenewableEnergyStepsState = {
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: {
    completed: true,
    payload: { reinstatementExpenses: [{ purpose: "demolition", amount: 10000 }] },
  },
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
    completed: true,
    payload: { reinstatementContractOwner: { name: "Test", structureType: "company" } },
  },
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: {
    completed: true,
    payload: { firstYearOfOperation: 2025 },
  },
};

describe("Renewable energy - InvolvesReinstatement handler dependency rules", () => {
  it("deletes reinstatement steps and invalidates schedule when switching from true to false", () => {
    const answers: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: true },
      },
      ...REINSTATEMENT_STEPS,
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: false },
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION", action: "invalidate" },
    ]);
  });

  it("fires the rules when switching from unset to false (previous !== false)", () => {
    const answers: RenewableEnergyStepsState = {
      ...REINSTATEMENT_STEPS,
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: false },
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION", action: "invalidate" },
    ]);
  });

  it("returns no rule when the value did not change (false to false)", () => {
    const answers: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: false },
      },
      ...REINSTATEMENT_STEPS,
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: false },
    );

    expect(rules).toEqual([]);
  });

  it("returns no rule when switching from false to true", () => {
    const answers: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: false },
      },
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: true },
    );

    expect(rules).toEqual([]);
  });

  it("returns no rule when switching from true to true", () => {
    const answers: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: true },
      },
      ...REINSTATEMENT_STEPS,
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: true },
    );

    expect(rules).toEqual([]);
  });

  it("guards each rule on the target step existing (only schedule present)", () => {
    const answers: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: true },
      },
      RENEWABLE_ENERGY_SCHEDULE_PROJECTION: {
        completed: true,
        payload: { firstYearOfOperation: 2025 },
      },
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: false },
    );

    expect(rules).toEqual([
      { stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION", action: "invalidate" },
    ]);
  });

  it("returns no rule when target steps are absent even on a true to false switch", () => {
    const answers: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: true },
      },
    };

    const rules = InvolvesReinstatementHandler.getDependencyRules!(
      { context: CONTEXT, answers },
      { involvesReinstatement: false },
    );

    expect(rules).toEqual([]);
  });
});
