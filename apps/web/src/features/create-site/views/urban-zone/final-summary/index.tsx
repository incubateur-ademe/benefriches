import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanZoneFinalSummaryViewData } from "@/features/create-site/core/urban-zone/steps/final-summary/finalSummary.selectors";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import UrbanZoneFinalSummary from "./UrbanZoneFinalSummary";

function UrbanZoneFinalSummaryContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectUrbanZoneFinalSummaryViewData);

  return (
    <UrbanZoneFinalSummary
      {...viewData}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default UrbanZoneFinalSummaryContainer;
