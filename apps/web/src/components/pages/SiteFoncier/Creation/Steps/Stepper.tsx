import { Route } from "type-route";
import { useContext, useMemo } from "react";

import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { routes } from "@/router";
import { FormDataContext } from "../StateProvider";
import { SiteKindsType } from "../../constants";

type ArraySection = Array<"type" | "adresse" | "espaces">;
type SectionsByKind = {
  [key in SiteKindsType]: ArraySection;
};

const SECTIONS_BY_KIND: SectionsByKind = {
  friche: [
    "type",
    "adresse",
    "espaces",
    // "gestion",
    // "denomination",
    // "confirmation"
  ],
  "terre agricole": [],
  forêt: [],
  prairie: [],
};

const DEFAULT_STEPPER = {
  currentStep: 1,
  nextTitle: "Adresse",
  stepCount: 5,
  title: "Type",
};

type Props = {
  route: Route<typeof routes.siteFoncierForm>;
};

function SiteFoncierCreationStepper({ route }: Props) {
  const { params } = route;
  const [section] = params.question.split(".") as ArraySection;

  const { kind } = useContext(FormDataContext);

  const stepperProps = useMemo(() => {
    if (!kind || !section) {
      return DEFAULT_STEPPER;
    }
    const sections = SECTIONS_BY_KIND[kind];
    const currentStepIndex = sections.indexOf(section);
    const currentStep = currentStepIndex + 1;
    const stepCount = sections.length;
    const title = section.charAt(0).toUpperCase() + section.slice(1);

    if (currentStepIndex === stepCount - 1) {
      return {
        currentStep,
        stepCount,
        title,
      };
    }

    const nextSection = sections[currentStepIndex + 1];

    return {
      currentStep,
      nextTitle: nextSection.charAt(0).toUpperCase() + nextSection.slice(1),
      stepCount,
      title,
    };
  }, [kind, section]);

  return <>{section && <Stepper {...stepperProps} />}</>;
}

export default SiteFoncierCreationStepper;
