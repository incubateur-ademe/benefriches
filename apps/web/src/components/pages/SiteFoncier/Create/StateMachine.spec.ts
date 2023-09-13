import { interpret } from "xstate";
import stateMachine, { FRICHE_STATES, STATES } from "./StateMachine";
import { SiteFoncierType } from "../siteFoncier";

describe("Site foncier state machine: NEXT transitions", () => {
  it("should display initial state", () => {
    const expectedValue = STATES.TYPE_STEP;
    expect(stateMachine.initialState.value).toEqual(expectedValue);
  });

  it("should transition from Type to En construction", () => {
    const actualState = stateMachine.transition(STATES.TYPE_STEP, {
      type: "NEXT",
    });
    expect(actualState.matches(STATES.BUILDING)).toBeTruthy();
  });

  it("should transition from Type to Adresse", () => {
    const nextState = stateMachine.transition(STATES.TYPE_STEP, {
      type: "STORE_VALUE",
      data: { type: SiteFoncierType.FRICHE },
    });
    const actualState = stateMachine.transition(nextState, { type: "NEXT" });
    expect(actualState.matches(STATES.ADDRESS_STEP)).toBeTruthy();
  });

  it("should store type and address", () => {
    const nextState = stateMachine.transition(STATES.TYPE_STEP, {
      type: "STORE_VALUE",
      data: { type: SiteFoncierType.FRICHE },
    });
    const actualState = stateMachine.transition(nextState, {
      type: "STORE_VALUE",
      data: { address: "2 rue de la paix" },
    });
    expect(actualState.context.type).toEqual(SiteFoncierType.FRICHE);
    expect(actualState.context.address).toEqual("2 rue de la paix");
  });

  it("should transition from Adresse to Friche sub machine", () => {
    return new Promise<void>((done) => {
      const machine = interpret(stateMachine)
        .onTransition((state) => {
          if (state.matches({ selected: STATES.ADDRESS_STEP })) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(state.context.type).toBeDefined();
          }
          if (state.matches(STATES.FRICHE_MACHINE)) {
            done();
          }
        })
        .start();

      machine.send([
        { type: "STORE_VALUE", data: { type: SiteFoncierType.FRICHE } },
        { type: "NEXT" },
        { type: "NEXT" },
      ]);

      machine.stop();
    });
  });

  describe("Friche submachine: NEXT transitions", () => {
    it("should display initial state", () => {
      const fricheMachine = stateMachine.withContext({
        type: SiteFoncierType.FRICHE,
      });
      const addressStep = fricheMachine.transition(
        stateMachine.initialState.value,
        "NEXT",
      );
      const actualState = fricheMachine.transition(addressStep, "NEXT");
      const expectedState = {
        [STATES.FRICHE_MACHINE]: FRICHE_STATES.LAST_ACTIVITY,
      };
      expect(actualState.matches(expectedState)).toBeTruthy();
    });

    it("should transition from initial state to final state", () => {
      const fricheMachine = stateMachine.withContext({
        type: SiteFoncierType.FRICHE,
      });
      const addressStep = fricheMachine.transition(
        stateMachine.initialState.value,
        "NEXT",
      );
      const espacesActivites = fricheMachine.transition(addressStep, "NEXT");
      const espacesTypes = fricheMachine.transition(espacesActivites, "NEXT");
      const espacesSurfaces = fricheMachine.transition(espacesTypes, "NEXT");
      const denomination = fricheMachine.transition(espacesSurfaces, "NEXT");
      const finalState = fricheMachine.transition(denomination, "NEXT");
      expect(finalState.value).toEqual(STATES.CONFIRMATION);
      expect(finalState.done).toBeTruthy();
    });

    it("should transition from last activity to surfaces distribution if type is agricole and assign surfaces in context", () => {
      const fricheMachine = stateMachine.withContext({
        type: SiteFoncierType.FRICHE,
        lastActivity: "agricole",
      });
      const addressStep = fricheMachine.transition(
        stateMachine.initialState.value,
        "NEXT",
      );
      const espacesActivites = fricheMachine.transition(addressStep, "NEXT");
      const actualState = fricheMachine.transition(espacesActivites, "NEXT");
      const expectedState = {
        [STATES.FRICHE_MACHINE]: FRICHE_STATES.SURFACES_DISTRIBUTION,
      };
      expect(actualState.matches(expectedState)).toBeTruthy();
      expect(actualState.context.surfaces).toEqual([
        { type: "natural_areas", superficie: 0 },
      ]);
    });
  });
});

describe("Site foncier state machine: BACK transitions", () => {
  it("should display initial state and cannot go back", () => {
    const expectedValue = STATES.TYPE_STEP;
    expect(stateMachine.initialState.value).toEqual(expectedValue);

    const machine = interpret(stateMachine).start();

    machine.subscribe((state) => {
      expect(state.can("BACK")).toEqual(false);
    });

    const result = machine.send({ type: "BACK" });
    expect(result.changed).toEqual(false);
    machine.stop();
  });

  it("should transition from En contruction to Type", () => {
    const typeState = stateMachine.transition(STATES.BUILDING, "BACK");

    expect(typeState.matches(STATES.TYPE_STEP)).toBeTruthy();
  });

  it("should transition from Adresse to Type though BACK event", () => {
    const nextState = stateMachine
      .withContext({ type: SiteFoncierType.FRICHE })
      .transition(STATES.ADDRESS_STEP, { type: "BACK" });
    expect(nextState.matches(STATES.TYPE_STEP)).toBeTruthy();
  });

  describe("Friche submachine: BACK transitions", () => {
    it("should transition from Friche sub machine to adresse", () => {
      const nextState = stateMachine
        .withContext({ type: SiteFoncierType.FRICHE })
        .transition(`${STATES.FRICHE_MACHINE}.${FRICHE_STATES.LAST_ACTIVITY}`, {
          type: "BACK",
        });
      expect(nextState.matches(STATES.ADDRESS_STEP)).toBeTruthy();
    });

    it("should transition from final state to initial state", () => {
      const fricheMachine = stateMachine.withContext({
        type: SiteFoncierType.FRICHE,
      });
      const espacesSurfaces = fricheMachine.transition(
        STATES.DENOMINATION,
        "BACK",
      );
      const espacesTypes = fricheMachine.transition(espacesSurfaces, "BACK");
      const actualState = fricheMachine.transition(espacesTypes, "BACK");

      expect(
        actualState.matches({
          [STATES.FRICHE_MACHINE]: FRICHE_STATES.LAST_ACTIVITY,
        }),
      ).toBeTruthy();
    });

    it("should transition from surfaces distribution to last activity if type is agricole", () => {
      const fricheMachine = stateMachine.withContext({
        type: SiteFoncierType.FRICHE,
        lastActivity: "agricole",
      });
      const actualState = fricheMachine.transition(
        {
          [STATES.FRICHE_MACHINE]: FRICHE_STATES.SURFACES_DISTRIBUTION,
        },
        "BACK",
      );

      expect(
        actualState.matches({
          [STATES.FRICHE_MACHINE]: FRICHE_STATES.LAST_ACTIVITY,
        }),
      ).toBeTruthy();
    });
  });
});
