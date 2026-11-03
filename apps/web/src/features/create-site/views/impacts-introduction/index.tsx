import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { stepReverted } from "../../core/actions/revert.action";
import { selectSiteImpactsIntroductionViewData } from "../../core/steps/introduction/impactsIntroduction.selectors";
import { impactsIntroductionStepCompleted } from "../../core/steps/introduction/introduction.actions";
import SiteImpactsIntroduction from "./SiteImpactsIntroduction";

export default function SiteImpactsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const { showsAvoidedCosts } = useAppSelector(selectSiteImpactsIntroductionViewData);

  return (
    <SiteImpactsIntroduction
      showsAvoidedCosts={showsAvoidedCosts}
      onNext={() => dispatch(impactsIntroductionStepCompleted())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}
