import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import UrbanZoneManagementIntroduction from "./UrbanZoneManagementIntroduction";

function ManagementIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanZoneManagementIntroduction
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default ManagementIntroductionContainer;
