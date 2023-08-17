import { Route } from "type-route";
import { useMemo } from "react";

import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { routes } from "@/router";

const SECTIONS = {
  type: {
    stepCount: 1,
    nextTitle: "Adresse",
    title: "Type",
  },
  adresse: {
    stepCount: 2,
    nextTitle: "Espaces",
    title: "Adresse",
  },
  espaces: {
    stepCount: 3,
    nextTitle: undefined,
    title: "Espaces",
  },
};

const SECTION_COUNT = Object.keys(SECTIONS).length;

type Section = "type" | "adresse" | "espaces";

function SiteFoncierCreationStepper(props: {
  route: Route<typeof routes.siteFoncierForm>;
}) {
  const { params } = useMemo(() => props.route, [props]);
  const [section] = useMemo<Array<Section>>(
    () => params.question.split(".") as Array<Section>,
    [params],
  );

  const { stepCount, nextTitle, title } = useMemo(() => {
    return SECTIONS[section];
  }, [section]);

  return (
    <>
      {section && (
        <Stepper
          currentStep={stepCount}
          nextTitle={nextTitle}
          stepCount={SECTION_COUNT}
          title={title}
        />
      )}
    </>
  );
}

export default SiteFoncierCreationStepper;
