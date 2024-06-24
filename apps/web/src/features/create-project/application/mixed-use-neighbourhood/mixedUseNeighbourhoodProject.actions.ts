import { createAction as _createAction } from "@reduxjs/toolkit";

const createAction = <TPayload>(actionName: string) =>
  _createAction<TPayload>(`projectCreation/mixedUseNeighbourhood/${actionName}`);

export const createModeSelected = createAction<"express" | "custom">("createModeSelected");
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const createModeStepReverted = createAction<void>("createModeStepReverted");

export type MixedUseNeighbourhoodAction = ReturnType<typeof createModeSelected>;
