import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { StateFrom } from "xstate";
import stateMachine, { FRICHE_STATES, STATES } from "../StateMachine";

const STEPS = {
  [STATES.TYPE_STEP]: {
    currentStep: 1,
    title: "Type de site",
  },
  [STATES.ADDRESS_STEP]: {
    currentStep: 2,
    title: "Adresse",
  },
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.LAST_ACTIVITY}`]: {
    currentStep: 3,
    title: "Espaces",
  },
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_TYPES}`]: {
    currentStep: 3,
    title: "Espaces",
  },
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_DISTRIBUTION}`]: {
    currentStep: 3,
    title: "Espaces",
  },
  [STATES.DENOMINATION]: {
    currentStep: 4,
    title: "Dénomination",
  },
};

type Props = {
  state: StateFrom<typeof stateMachine>;
};

function SiteFoncierCreationStepper({ state }: Props) {
  if (state.done) {
    return null;
  }

  const stepKey = Object.keys(STEPS).find((key) => state.matches(key));

  if (stepKey) {
    return <Stepper {...STEPS[stepKey]} stepCount={4} />;
  }

  return null;
}

export default SiteFoncierCreationStepper;
