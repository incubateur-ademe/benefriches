import { createAction } from "@reduxjs/toolkit";

import { createStepRevertAttempted } from "../../actions/actionsUtils";
import { introductionStepCompleted } from "../../actions/introductionStep.actions";
import { completeSoilsTransformationIntroductionStep } from "./renewableEnergy.actions";
import {
  createRenewableEnergyStepRevertAttemptedAction,
  isRenewableEnergyStepRevertAttemptedAction,
} from "./revert.actions";

describe("renewableEnergy actions utils", () => {
  describe("isRenewableEnergyStepRevertAttemptedAction", () => {
    it("returns true for renewable energy revert actions", () => {
      const action = createRenewableEnergyStepRevertAttemptedAction();
      expect(isRenewableEnergyStepRevertAttemptedAction(action)).toBe(true);
    });

    it("returns true for renewable energy other action", () => {
      const action = completeSoilsTransformationIntroductionStep();
      expect(isRenewableEnergyStepRevertAttemptedAction(action)).toBe(false);
    });

    it("returns false for urban project revert action", () => {
      const action = createStepRevertAttempted("SOME_ACTION");
      expect(isRenewableEnergyStepRevertAttemptedAction(action)).toBe(false);
    });

    it("returns false for project creation revert action", () => {
      const action = introductionStepCompleted();
      expect(isRenewableEnergyStepRevertAttemptedAction(action)).toBe(false);
    });

    it("returns false for random action", () => {
      const action = createAction("RANDOM_ACTION_REVERT");
      expect(isRenewableEnergyStepRevertAttemptedAction(action)).toBe(false);
    });
  });
});
