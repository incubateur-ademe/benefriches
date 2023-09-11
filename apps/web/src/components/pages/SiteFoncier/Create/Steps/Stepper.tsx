import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { StateFrom } from "xstate";
import stateMachine, { FRICHE_STATES, STATES } from "../StateMachine";

const STEPS = {
  [STATES.ADDRESS]: {
    currentStep: 2,
    nextTitle: "Espaces",
    stepCount: 4,
    title: "Adresse",
  },
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.LAST_ACTIVITY}`]: {
    currentStep: 3,
    nextTitle: "Espaces",
    stepCount: 4,
    title: "Espaces",
  },
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_CATEGORIES}`]: {
    currentStep: 3,
    nextTitle: "Espaces",
    stepCount: 4,
    title: "Espaces",
  },
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_DISTRIBUTION}`]: {
    currentStep: 3,
    nextTitle: "Dénomination",
    stepCount: 4,
    title: "Espaces",
  },
};

type Props = {
  state: StateFrom<typeof stateMachine>;
};

function SiteFoncierCreationStepper({ state }: Props) {
  if (state.done) {
    return null;
  }

  if (state.matches(STATES.TYPE_STEP)) {
    return (
      <div className="fr-stepper">
        <h2 className="fr-stepper__title">
          <span className="fr-stepper__state">Étape 1</span>
          Type
        </h2>
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span> Adresse
        </p>
      </div>
    );
  }
  const stepKey = Object.keys(STEPS).find((key) => state.matches(key));

  if (stepKey) {
    return <Stepper {...STEPS[stepKey]} />;
  }

  return null;
}

export default SiteFoncierCreationStepper;
