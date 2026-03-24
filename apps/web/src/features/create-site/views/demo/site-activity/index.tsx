import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/demo/demoFactory";
import { selectSiteActivityViewData } from "@/features/create-site/core/demo/steps/site-activity/siteActivity.selectors";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { HTML_MAIN_TITLE } from "../../SiteCreationWizard";
import AgriculturalOperationActivityForm from "../../common-views/agricultural-operation-activity/AgriculturalOperationActivityForm";
import NaturalAreaTypeForm from "../../common-views/natural-area-type/NaturalAreaTypeForm";
import FricheActivityForm from "../../friche/friche-activity/FricheActivityForm";

function SiteActivitySelectionFormContainer() {
  const dispatch = useAppDispatch();
  const { siteNature, agriculturalOperationActivity, naturalAreaType, fricheActivity } =
    useAppSelector(selectSiteActivityViewData);

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  if (siteNature === "AGRICULTURAL_OPERATION") {
    return (
      <>
        <HtmlTitle>{`Activité de l'exploitation - ${HTML_MAIN_TITLE}`}</HtmlTitle>
        <AgriculturalOperationActivityForm
          onBack={onBack}
          onSubmit={(data) => {
            dispatch(
              stepCompletionRequested({
                stepId: "DEMO_SITE_ACTIVITY_SELECTION",
                answers: { siteNature, agriculturalOperationActivity: data.activity },
              }),
            );
          }}
          initialValues={{ activity: agriculturalOperationActivity }}
        />
      </>
    );
  }

  if (siteNature === "FRICHE") {
    return (
      <>
        <HtmlTitle>{`Ancienne activité - ${HTML_MAIN_TITLE}`}</HtmlTitle>
        <FricheActivityForm
          onBack={onBack}
          onSubmit={(data) => {
            dispatch(
              stepCompletionRequested({
                stepId: "DEMO_SITE_ACTIVITY_SELECTION",
                answers: { siteNature, fricheActivity: data.activity },
              }),
            );
          }}
          initialValues={{ activity: fricheActivity }}
        />
      </>
    );
  }

  if (siteNature === "NATURAL_AREA") {
    return (
      <>
        <HtmlTitle>{`Type de surface de nature - ${HTML_MAIN_TITLE}`}</HtmlTitle>
        <NaturalAreaTypeForm
          onBack={onBack}
          onSubmit={(data) => {
            dispatch(
              stepCompletionRequested({
                stepId: "DEMO_SITE_ACTIVITY_SELECTION",
                answers: { siteNature, naturalAreaType: data.type },
              }),
            );
          }}
          initialValues={{ type: naturalAreaType }}
        />
      </>
    );
  }

  return null;
}

export default SiteActivitySelectionFormContainer;
