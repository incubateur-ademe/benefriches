import { createRouter, defineRoute, param } from "type-route";

const questions = [
  "construction",
  "intro",
  "type",
  "adresse",
  "espaces.types",
  "espaces.surfaces",
  "confirmation",
] as const;

type Question = (typeof questions)[number];

const siteFoncierForm = defineRoute(
  {
    question: param.query.optional.ofType<Question>().default("intro"),
  },
  () => "/site-foncier/form",
);

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  siteFoncierForm,
});

export { RouteProvider, useRoute, routes, questions };
