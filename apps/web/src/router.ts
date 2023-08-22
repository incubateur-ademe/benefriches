import { createRouter, defineRoute, param } from "type-route";

export type QuestionType =
  | "construction"
  | "intro"
  | "type"
  | "adresse"
  | "espaces.types"
  | "espaces.surfaces"
  | "confirmation";

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  siteFoncierForm: defineRoute(
    {
      question: param.query.optional.ofType<QuestionType>().default("intro"),
    },
    () => "/site-foncier/form",
  ),
});

export { RouteProvider, useRoute, routes };
