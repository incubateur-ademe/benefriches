import { useCallback } from "react";

import { navigateToPrevious } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export const useStepBack = () => {
  const dispatch = useAppDispatch();

  const onBack = useCallback(() => {
    dispatch(navigateToPrevious());
  }, [dispatch]);

  return onBack;
};
