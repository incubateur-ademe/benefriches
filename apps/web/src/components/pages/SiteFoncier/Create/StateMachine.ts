import { createMachine, assign } from "xstate";

export const ALLOWED_CATEGORIES = [
  "friche",
  "terre agricole",
  "forêt",
  "prairie",
] as const;

export const ALLOWED_SURFACES_CATEGORIES = [
  "production",
  "storage",
  "quarry",
  "buildings",
  "concrete_car_park",
  "gravel_car_park",
  "other_sealed_surface",
  "non_vegetated_permeable_surface",
  "vegetated_surface",
  "open_ground",
  "body_of_water",
  "other",
] as const;

export type TContext = {
  category?: (typeof ALLOWED_CATEGORIES)[number];
  lastActivity?: "agricole" | "industrial" | "quarry" | "other";
  address?: string;
  surfaces?: Array<{
    category: (typeof ALLOWED_SURFACES_CATEGORIES)[number];
    superficie: number;
  }>;
  name?: string;
  description?: string;
};

type TStoreEvent = { type: "STORE_VALUE"; value: TContext };
type TEvent = { type: "NEXT" } | { type: "BACK" } | TStoreEvent;

const MACHINE_ID = "siteFoncier";

export const STATES = {
  CATEGORY: "type",
  ADDRESS: "adresse",
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
    initial: `${STATES.CATEGORY}`,
    context: {} as TContext,
    states: {
      [STATES.CATEGORY]: {
        on: {
          STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
          NEXT: [
            {
              target: STATES.ADDRESS,
              cond: CONDITIONS.IS_FRICHE,
            },
            { target: STATES.BUILDING },
          ],
        },
      },
      [STATES.ADDRESS]: {
        on: {
          STORE_VALUE: { actions: STORE_CONTEXT_ACTION },
          NEXT: {
            target: STATES.FRICHE_MACHINE,
            cond: CONDITIONS.IS_FRICHE,
          },
          BACK: {
            target: STATES.CATEGORY,
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
                    surfaces: [{ category: "open_ground", superficie: 0 }],
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
            target: `#${MACHINE_ID}.${STATES.ADDRESS}`,
          },
        },
      },
      // ---- SUBMACHINE: Building ----
      [STATES.BUILDING]: {
        on: {
          BACK: {
            target: STATES.CATEGORY,
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
      [STORE_CONTEXT_ACTION]: assign((_, event: TStoreEvent) => event.value),
    },
    services: {},
    guards: {
      [CONDITIONS.IS_FRICHE]: (context: TContext) =>
        context.category === "friche",
      [CONDITIONS.IS_AGRICOLE]: (context: TContext) =>
        context.lastActivity === "agricole",
    },
    delays: {},
  },
);
