import { useCallback } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";

import { previousStepRequested } from "../../core/demo/demoProject.reducer";

export const useStepBack = () => {
  const dispatch = useAppDispatch();

  const onBack = useCallback(() => {
    dispatch(previousStepRequested());
  }, [dispatch]);

  return onBack;
};
