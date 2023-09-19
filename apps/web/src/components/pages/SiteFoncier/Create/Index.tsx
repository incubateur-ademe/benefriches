import { useMachine } from "@xstate/react";
import { SiteFoncierPublicodesProvider } from "../PublicodesProvider";
import { FricheSurfaceType } from "../siteFoncier";
import SiteFoncierCreationStepAddress from "./Steps/Address";
import SiteFoncierCreationConfirmation from "./Steps/Confirmation";
import SiteFoncierCreationConstruction from "./Steps/Construction";
import SiteFoncierCreationStepDenomination from "./Steps/Denomination";
import SiteFoncierCreationStepFricheLastActivity from "./Steps/friche/FricheLastActivity";
import SiteFoncierCreationStepFricheSurfacesDistribution from "./Steps/friche/FricheSurfacesDistribution";
import SiteFoncierCreationStepFricheSurfacesTypes from "./Steps/friche/FricheSurfacesType";
import SiteFoncierCreationStepper from "./Steps/Stepper";
import SiteFoncierCreationStepType from "./Steps/Type";
import stateMachine, { FRICHE_STATES, STATES, TContext } from "./StateMachine";

function CreateSiteFoncierPage() {
  const [state, send] = useMachine(stateMachine);
  const statesAsString = state.toStrings();

  const onNext = (data: Partial<TContext>) => {
    send("STORE_VALUE", { data });
    send("NEXT");
  };

  const onBack = () => {
    send("BACK");
  };

  const getStepComponent = () => {
    const STEPS_COMPONENTS = {
      [STATES.BUILDING]: <SiteFoncierCreationConstruction />,
      [STATES.TYPE_STEP]: <SiteFoncierCreationStepType onSubmit={onNext} />,
      [STATES.ADDRESS_STEP]: (
        <SiteFoncierCreationStepAddress onSubmit={onNext} onBack={onBack} />
      ),
      [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.LAST_ACTIVITY}`]: (
        <SiteFoncierCreationStepFricheLastActivity
          onSubmit={onNext}
          onBack={onBack}
        />
      ),
      [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_TYPES}`]: (
        <SiteFoncierCreationStepFricheSurfacesTypes
          onSubmit={(data: Record<FricheSurfaceType, boolean>) => {
            const surfaces = Object.entries(data)
              .filter(([, value]) => {
                return value;
              })
              .map(([surfaceType]) => {
                return { type: surfaceType as FricheSurfaceType };
              });
            onNext({ surfaces });
          }}
          onBack={onBack}
        />
      ),
      [`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_DISTRIBUTION}`]: (
        <SiteFoncierCreationStepFricheSurfacesDistribution
          surfaces={state.context.surfaces!}
          onSubmit={(data) => {
            const surfaces = Object.entries(data).map(([type, surface]) => ({
              type: type as FricheSurfaceType,
              surface,
            }));
            onNext({ surfaces });
          }}
        />
      ),
      [STATES.DENOMINATION]: (
        <SiteFoncierCreationStepDenomination
          onSubmit={onNext}
          onBack={onBack}
        />
      ),
      [STATES.CONFIRMATION]: (
        <SiteFoncierCreationConfirmation site={state.context} />
      ),
    };

    const stepKey = statesAsString.at(-1);
    return STEPS_COMPONENTS[stepKey as string];
  };

  return (
    <SiteFoncierPublicodesProvider>
      <SiteFoncierCreationStepper state={state} />
      {getStepComponent()}
    </SiteFoncierPublicodesProvider>
  );
}

export default CreateSiteFoncierPage;
