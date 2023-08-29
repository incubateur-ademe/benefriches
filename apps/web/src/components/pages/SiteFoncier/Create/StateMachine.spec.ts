import { interpret } from "xstate";
import stateMachine, { FRICHE_STATES, STATES } from "./StateMachine";

describe("State machine: Site foncier", () => {
  it("should display initial state", () => {
    const expectedValue = STATES.CATEGORY;
    expect(stateMachine.initialState.value).toEqual(expectedValue);
  });

  it("should transition from Type to En construction", () => {
    const actualState = stateMachine.transition(STATES.CATEGORY, {
      type: "NEXT",
    });
    expect(actualState.matches(STATES.BUILDING)).toBeTruthy();
  });

  it("should transition from Type to Adresse", () => {
    const nextState = stateMachine.transition(STATES.CATEGORY, {
      type: "STORE_VALUE",
      value: { category: "friche" },
    });
    const actualState = stateMachine.transition(nextState, { type: "NEXT" });
    expect(actualState.matches(STATES.ADDRESS)).toBeTruthy();
  });

  it("should store category and address", () => {
    const nextState = stateMachine.transition(STATES.CATEGORY, {
      type: "STORE_VALUE",
      value: { category: "friche" },
    });
    const actualState = stateMachine.transition(nextState, {
      type: "STORE_VALUE",
      value: { address: "2 rue de la paix" },
    });
    expect(actualState.context.category).toEqual("friche");
    expect(actualState.context.address).toEqual("2 rue de la paix");
  });

  it("should transition from Adresse to Friche sub machine", () => {
    return new Promise<void>((done) => {
      const machine = interpret(stateMachine)
        .onTransition((state) => {
          if (state.matches({ selected: STATES.ADDRESS })) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(state.context.category).toBeDefined();
          }
          if (state.matches(STATES.FRICHE_MACHINE)) {
            done();
          }
        })
        .start();

      machine.send([
        { type: "STORE_VALUE", value: { category: "friche" } },
        { type: "NEXT" },
        { type: "NEXT" },
      ]);

      machine.stop();
    });
  });

  describe("Friche submachine", () => {
    it("should display initial state", () => {
      const fricheMachine = stateMachine.withContext({ category: "friche" });
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
      const fricheMachine = stateMachine.withContext({ category: "friche" });
      const addressStep = fricheMachine.transition(
        stateMachine.initialState.value,
        "NEXT",
      );
      const espacesActivites = fricheMachine.transition(addressStep, "NEXT");
      const espacesTypes = fricheMachine.transition(espacesActivites, "NEXT");
      const espacesSurfaces = fricheMachine.transition(espacesTypes, "NEXT");
      const finalState = fricheMachine.transition(espacesSurfaces, "NEXT");
      expect(finalState.value).toEqual(STATES.CONFIRMATION);
      expect(finalState.done).toBeTruthy();
    });

    it("should transition from last activity to surfaces distribution", () => {
      const fricheMachine = stateMachine.withContext({
        category: "friche",
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
    });
  });
});
