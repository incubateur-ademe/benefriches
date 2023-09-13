import { createMachine, assign } from "xstate";
import { FricheSite, FricheSurfaceType, SiteFoncierType } from "../siteFoncier";

export type TContext = {
  type?: SiteFoncierType;
  lastActivity?: FricheSite["lastActivity"];
  address?: string;
  surfaces?: Array<{
    type: FricheSurfaceType;
    superficie?: number;
  }>;
  name?: string;
  description?: string;
};

type TStoreEvent = { type: "STORE_VALUE"; data: TContext };
type TEvent = { type: "NEXT" } | { type: "BACK" } | TStoreEvent;

const MACHINE_ID = "siteFoncier";

export const STATES = {
  TYPE_STEP: "type",
  ADDRESS_STEP: "adresse",
  FRICHE_MACHINE: "fricheMachine",
  BUILDING: "construction",
  DENOMINATION: "denomination",
  CONFIRMATION: "confirmation",
};

export const FRICHE_STATES = {
  LAST_ACTIVITY: "espacesActivites",
  SURFACES_CATEGORIES: "espacesTypes",
  SURFACES_DISTRIBUTION: "espacesSurfaces",
};

const CONDITIONS = {
  IS_FRICHE: "categoryIsFriche",
  IS_AGRICOLE: "lastActivityIsAgricole",
};

const STORE_CONTEXT_ACTION = "storeContext";

export default createMachine(
  {
    id: MACHINE_ID,
    initial: STATES.TYPE_STEP,
    context: {} as TContext,
    states: {
      [STATES.TYPE_STEP]: {
        on: {
          STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
          NEXT: [
            {
              target: STATES.ADDRESS_STEP,
              cond: CONDITIONS.IS_FRICHE,
            },
            { target: STATES.BUILDING },
          ],
        },
      },
      [STATES.ADDRESS_STEP]: {
        on: {
          STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
          NEXT: {
            target: STATES.FRICHE_MACHINE,
            cond: CONDITIONS.IS_FRICHE,
          },
          BACK: {
            target: STATES.TYPE_STEP,
          },
        },
      },
      // ---- SUBMACHINE: Friche ----
      [STATES.FRICHE_MACHINE]: {
        initial: FRICHE_STATES.LAST_ACTIVITY,
        states: {
          [FRICHE_STATES.LAST_ACTIVITY]: {
            on: {
              STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
              NEXT: [
                {
                  target: FRICHE_STATES.SURFACES_DISTRIBUTION,
                  cond: CONDITIONS.IS_AGRICOLE,
                  actions: assign({
                    surfaces: [{ type: "natural_areas", superficie: 0 }],
                  }),
                },
                {
                  target: FRICHE_STATES.SURFACES_CATEGORIES,
                },
              ],
            },
          },
          [FRICHE_STATES.SURFACES_CATEGORIES]: {
            on: {
              STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
              NEXT: {
                target: FRICHE_STATES.SURFACES_DISTRIBUTION,
              },
              BACK: {
                target: FRICHE_STATES.LAST_ACTIVITY,
              },
            },
          },
          [FRICHE_STATES.SURFACES_DISTRIBUTION]: {
            on: {
              STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
              NEXT: {
                target: `#${MACHINE_ID}.${STATES.DENOMINATION}`,
              },
              BACK: [
                {
                  target: FRICHE_STATES.LAST_ACTIVITY,
                  cond: CONDITIONS.IS_AGRICOLE,
                },
                {
                  target: FRICHE_STATES.SURFACES_CATEGORIES,
                },
              ],
            },
          },
        },
        on: {
          BACK: {
            target: `#${MACHINE_ID}.${STATES.ADDRESS_STEP}`,
          },
        },
      },
      // ---- SUBMACHINE: Building ----
      [STATES.BUILDING]: {
        on: {
          BACK: {
            target: STATES.TYPE_STEP,
          },
        },
      },
      // ---- COMMON ----
      [STATES.DENOMINATION]: {
        on: {
          STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
          NEXT: { target: STATES.CONFIRMATION },
          BACK: [
            {
              target: `${STATES.FRICHE_MACHINE}.${FRICHE_STATES.SURFACES_DISTRIBUTION}`,
              cond: CONDITIONS.IS_FRICHE,
            },
            {
              target: STATES.BUILDING,
            },
          ],
        },
      },
      [STATES.CONFIRMATION]: {
        type: "final",
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    schema: {
      context: {} as TContext,
      events: {} as TEvent,
    },
  },
  {
    actions: {
      [STORE_CONTEXT_ACTION]: assign((context, event: TStoreEvent) => {
        return {
          ...context,
          ...event.data,
        };
      }),
    },
    services: {},
    guards: {
      [CONDITIONS.IS_FRICHE]: (context: TContext) =>
        context.type === SiteFoncierType.FRICHE,
      [CONDITIONS.IS_AGRICOLE]: (context: TContext) =>
        context.lastActivity === "agricole",
    },
    delays: {},
  },
);
