import { useMemo } from "react";
import { Route } from "type-route";
import { routes } from "@/router";

import { FormDataProvider } from "./StateProvider";
import SiteFoncierCreationFormQuestionKind from "./Steps/QuestionKind";
import SiteFoncierCreationFormStepper from "./Steps/Stepper";
import SiteFoncierCreationConstruction from "./Steps/Construction";
import SiteFoncierCreationIntro from "./Steps/Intro";
import SiteFoncierCreationQuestionAddress from "./Steps/QuestionAddress";
import SiteFoncierCreationQuestionSpacesKind from "./Steps/QuestionSpacesKind";
import SiteFoncierCreationQuestionSpacesSize from "./Steps/QuestionSpacesSize";
import SiteFoncierCreationConfirmation from "./Steps/Confirmation";
import { SiteFoncierPublicodesProvider } from "../PublicodesProvider";

const TRAME = {
  construction: SiteFoncierCreationConstruction,
  intro: SiteFoncierCreationIntro,
  type: SiteFoncierCreationFormQuestionKind,
  adresse: SiteFoncierCreationQuestionAddress,
  "espaces.types": SiteFoncierCreationQuestionSpacesKind,
  "espaces.surfaces": SiteFoncierCreationQuestionSpacesSize,
  confirmation: SiteFoncierCreationConfirmation,
};

const STEPPER_EXCLUDES = ["intro", "construction", "confirmation"];

function SiteFoncierCreation(props: {
  route: Route<typeof routes.siteFoncierForm>;
}) {
  const { question } = useMemo(() => props.route.params, [props]);
  const Component = useMemo(() => TRAME[question], [question]);

  return (
    <>
      {!STEPPER_EXCLUDES.includes(question) && (
        <SiteFoncierCreationFormStepper route={props.route} />
      )}

      <SiteFoncierPublicodesProvider>
        <FormDataProvider>{question && <Component />}</FormDataProvider>
      </SiteFoncierPublicodesProvider>
    </>
  );
}

export default SiteFoncierCreation;
