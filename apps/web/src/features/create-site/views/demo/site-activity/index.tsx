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
          instructions={
            <div className="flex flex-col gap-4">
              <span className="text-3xl!" aria-hidden="true" role="img">
                🌽
              </span>
              <strong className="text-xl">
                Pourquoi renseigner le type d'exploitation agricole&nbsp;?
              </strong>
              En fonction du type d'exploitation agricole, certains indicateurs n’auront pas les
              mêmes valeurs, comme par exemple :
              <ul>
                <li>Emploi</li>
                <li>Dépenses et recettes d'exploitation</li>
                <li>Affectation des sols</li>
              </ul>
            </div>
          }
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
          instructions={
            <div className="flex flex-col gap-4">
              <span className="text-3xl!" aria-hidden="true" role="img">
                🏭
              </span>
              <strong className="text-xl">Pourquoi renseigner le type de friche&nbsp;?</strong>
              En fonction du type de friche, certains indicateurs n’auront pas les mêmes valeurs,
              comme par exemple :
              <ul>
                <li>Surface polluée</li>
                <li>Dépenses de gestion et de sécurisation de la friche</li>
                <li>Valeur patrimoniale des bâtiments alentour</li>
              </ul>
            </div>
          }
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
          instructions={
            <div className="flex flex-col gap-4">
              <span className="text-3xl!" aria-hidden="true" role="img">
                🌲
              </span>
              <strong className="text-xl">
                Pourquoi renseigner le type d'espace naturel&nbsp;?
              </strong>
              En fonction du type type d'espace naturel, certains indicateurs n’auront pas les mêmes
              valeurs, comme par exemple :
              <ul>
                <li>Affectation des sols</li>
              </ul>
            </div>
          }
        />
      </>
    );
  }

  return null;
}

export default SiteActivitySelectionFormContainer;
