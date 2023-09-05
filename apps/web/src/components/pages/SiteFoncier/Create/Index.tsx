import SiteFoncierCreationStepCategory from "./Steps/Category";
import SiteFoncierCreationStepper from "./Steps/Stepper";
import SiteFoncierCreationConstruction from "./Steps/Construction";
import SiteFoncierCreationStepAddress from "./Steps/Address";
import SiteFoncierCreationStepFricheLastActivity from "./Steps/FricheLastActivity";
import SiteFoncierCreationStepFricheSurfacesCategory from "./Steps/FricheSurfacesCategory";
import SiteFoncierCreationStepFricheSurfacesDistribution from "./Steps/FricheSurfacesDistribution";
import SiteFoncierCreationConfirmation from "./Steps/Confirmation";
import { SiteFoncierPublicodesProvider } from "../PublicodesProvider";
import stateMachine, { STATES, FRICHE_STATES, TContext } from "./StateMachine";
import { useMachine } from "@xstate/react";
import { FormProvider, useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Button from "@codegouvfr/react-dsfr/Button";
import SiteFoncierCreationStepDenomination from "./Steps/Denomination";

const STEPS_COMPONENTS = {
  [STATES.BUILDING]: SiteFoncierCreationConstruction,
  [STATES.CATEGORY]: SiteFoncierCreationStepCategory,
  [STATES.ADDRESS]: SiteFoncierCreationStepAddress,
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.LAST_ACTIVITY}`]:
    SiteFoncierCreationStepFricheLastActivity,
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_CATEGORIES}`]:
    SiteFoncierCreationStepFricheSurfacesCategory,
  [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_DISTRIBUTION}`]:
    SiteFoncierCreationStepFricheSurfacesDistribution,
  [STATES.DENOMINATION]: SiteFoncierCreationStepDenomination,
  [STATES.CONFIRMATION]: SiteFoncierCreationConfirmation,
};

function CreateSiteFoncierPage() {
  const [state, send] = useMachine(stateMachine);
  const statesAsString = state.toStrings();

  const stepKey = Object.keys(STEPS_COMPONENTS).find((key) =>
    statesAsString.includes(key),
  );
  const StepComponent = stepKey
    ? STEPS_COMPONENTS[stepKey]
    : STEPS_COMPONENTS[STATES.BUILDING];

  const onNext = (value: TContext) => {
    send("STORE_VALUE", { value });
    send("NEXT");
  };

  const onBack = () => {
    send("BACK");
  };

  const { handleSubmit, reset, ...methods } = useForm<TContext>({
    defaultValues: state.context,
  });

  const onSubmit = handleSubmit((values) => onNext(values));

  return (
    <>
      <SiteFoncierPublicodesProvider>
        <FormProvider handleSubmit={handleSubmit} reset={reset} {...methods}>
          <SiteFoncierCreationStepper state={state} />
          <form onSubmit={onSubmit}>
            <StepComponent />

            {state.can("BACK") && state.can("NEXT") && (
              <ButtonsGroup
                buttonsEquisized
                inlineLayoutWhen="always"
                buttons={[
                  {
                    children: "Retour",
                    onClick: onBack,
                    priority: "secondary",
                    nativeButtonProps: { type: "button" },
                  },
                  {
                    children: "Suivant",
                    nativeButtonProps: { type: "submit" },
                  },
                ]}
              />
            )}
            {state.can("BACK") && !state.can("NEXT") && (
              <Button
                priority="secondary"
                nativeButtonProps={{ type: "button" }}
                onClick={onBack}
              >
                Retour
              </Button>
            )}
            {!state.can("BACK") && state.can("NEXT") && (
              <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
            )}
          </form>
        </FormProvider>
      </SiteFoncierPublicodesProvider>
    </>
  );
}

export default CreateSiteFoncierPage;
