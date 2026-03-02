import { useCallback } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";

export const useStepBack = () => {
  const dispatch = useAppDispatch();

  const onBack = useCallback(() => {
    dispatch(creationProjectFormUrbanActions.navigateToPrevious());
  }, [dispatch]);

  return onBack;
};
