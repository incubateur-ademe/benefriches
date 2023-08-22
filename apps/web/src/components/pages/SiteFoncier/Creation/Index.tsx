import { Route } from "type-route";
import { routes } from "@/router";

import { FormDataProvider } from "./StateProvider";
import SiteFoncierCreationFormQuestionKind from "./Steps/QuestionKind";
import SiteFoncierCreationFormStepper from "./Steps/Stepper";
import SiteFoncierCreationConstruction from "./Steps/Construction";
import SiteFoncierCreationIntro from "./Steps/Intro";
import SiteFoncierCreationQuestionAddress from "./Steps/QuestionAddress";
import QuestionSpacesSurfacesKind from "./Steps/QuestionSpacesSurfacesKind";
import QuestionSpacesSurfacesDistribution from "./Steps/QuestionSpacesSurfacesDistribution";
import SiteFoncierCreationConfirmation from "./Steps/Confirmation";
import { SiteFoncierPublicodesProvider } from "../PublicodesProvider";

const QUESTIONS_COMPONENTS_CORRELATION = {
  construction: SiteFoncierCreationConstruction,
  intro: SiteFoncierCreationIntro,
  type: SiteFoncierCreationFormQuestionKind,
  adresse: SiteFoncierCreationQuestionAddress,
  "espaces.types": QuestionSpacesSurfacesKind,
  "espaces.surfaces": QuestionSpacesSurfacesDistribution,
  confirmation: SiteFoncierCreationConfirmation,
};

const STEPPER_EXCLUDED = ["intro", "construction", "confirmation"];

type Props = {
  route: Route<typeof routes.siteFoncierForm>;
};

function SiteFoncierCreation({ route }: Props) {
  const { question } = route.params;
  const QuestionComponent = QUESTIONS_COMPONENTS_CORRELATION[question];

  return (
    <>
      <SiteFoncierPublicodesProvider>
        <FormDataProvider>
          {!STEPPER_EXCLUDED.includes(question) && (
            <SiteFoncierCreationFormStepper route={route} />
          )}
          {question && <QuestionComponent />}
        </FormDataProvider>
      </SiteFoncierPublicodesProvider>
    </>
  );
}

export default SiteFoncierCreation;
