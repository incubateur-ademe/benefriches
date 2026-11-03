import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  missingInformationStepCompleted,
  stepReverted,
} from "@/features/create-project/core/usecase-selection/useCaseSelection.actions";
import MissingInformationIntroduction from "@/shared/views/components/MissingInformationIntroduction/MissingInformationIntroduction";

function ProjectMissingInformationContainer() {
  const dispatch = useAppDispatch();

  return (
    <MissingInformationIntroduction
      onNext={() => dispatch(missingInformationStepCompleted())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default ProjectMissingInformationContainer;
