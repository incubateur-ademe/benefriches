import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { surfaceAreaInputModeUpdated } from "../core/actions/surfaceAreaInputModeUpdated.action";

export const useSurfaceAreaInputMode = () => {
  const inputMode = useAppSelector((state) => state.projectCreation.surfaceAreaInputMode);
  const dispatch = useAppDispatch();
  const onInputModeChange = (inputMode: "percentage" | "squareMeters") => {
    dispatch(surfaceAreaInputModeUpdated(inputMode));
  };

  return { inputMode, onInputModeChange };
};
