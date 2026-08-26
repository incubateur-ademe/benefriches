import { useLayoutEffect, useRef } from "react";

import { routes, useRoute } from "./router";

type AppRoute = ReturnType<typeof useRoute>;

const IGNORED_PARAMS_BY_ROUTE: Partial<Record<keyof typeof routes, Set<string>>> = {
  projectImpactsDevelopmentScore: new Set(["details", "documentation"]),
  projectImpactsBreakEvenLevel: new Set(["details", "documentation"]),
  projectAvoidedCostsAnalysis: new Set(["details", "documentation"]),
  projectImpacts: new Set(["details", "documentation"]),
};

function getComparableParams(route: AppRoute): Record<string, unknown> {
  if (route.name === false) return {};

  const ignoredParams = IGNORED_PARAMS_BY_ROUTE[route.name];
  if (!ignoredParams) return route.params;

  return Object.fromEntries(
    Object.entries(route.params).filter(([key]) => !ignoredParams.has(key)),
  );
}

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

/**
 * Remplace le scrollToTop natif de type-route (à désactiver via
 * createRouter({ scrollToTop: false })).
 * Scroll en haut de page à chaque navigation, sauf pour la page impacts où les contenus de modales sont contrôlés par les query params
 */
export function ScrollManager() {
  const route = useRoute();
  const prevRouteNameRef = useRef(route.name);
  const prevComparableParamsRef = useRef(getComparableParams(route));

  useLayoutEffect(() => {
    const comparableParams = getComparableParams(route);

    const routeNameChanged = route.name !== prevRouteNameRef.current;
    const otherParamsChanged = !shallowEqual(comparableParams, prevComparableParamsRef.current);

    if (routeNameChanged || otherParamsChanged) {
      window.scrollTo(0, 0);
    }

    prevRouteNameRef.current = route.name;
    prevComparableParamsRef.current = comparableParams;
  }, [route]);

  return null;
}
