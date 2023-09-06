import { createContext, useMemo, ReactNode, useCallback } from "react";

import PublicodesEngine from "publicodes";
import rules from "publicodes-rules";
import { TContext } from "./Create/StateMachine";

const SURFACES_CATEGORIES_CORRELATION = {
  impermeable_soils: "espaces . sols imperméabilisés",
  buildings: "espaces . bâtiments",
  permeable_artificial_soils: "espaces . sols artificialisés perméables",
  natural_areas: "espaces . espaces naturels",
  body_of_water: "espaces . plan d'eau",
  other: "espaces . autre",
} as const;

export type TSurfaceCategory = keyof typeof SURFACES_CATEGORIES_CORRELATION;

export type TSurfacesDistribution = TContext["surfaces"];

const publicodesEngine = new PublicodesEngine(rules);

type PublicodesKeys =
  (typeof SURFACES_CATEGORIES_CORRELATION)[TSurfaceCategory];
type PublicodesSurfacesDistribution = Record<PublicodesKeys, string>;
type SiteFoncierPublicodesProvider = {
  computeTotalSurface: () => number;
  setSurfaceSituation: (values: TSurfacesDistribution) => void;
};

const SiteFoncierPublicodesContext =
  createContext<SiteFoncierPublicodesProvider>({
    computeTotalSurface: () => 0,
    setSurfaceSituation: () => undefined,
  });

const formatSurfaceValuesForPublicodes = (
  values: TSurfacesDistribution,
): PublicodesSurfacesDistribution => {
  const publicodesArray = (values || []).map(({ category, superficie }) => {
    const newKey = SURFACES_CATEGORIES_CORRELATION[category];
    return [newKey, `${superficie || 0}m2`];
  });
  return Object.fromEntries(publicodesArray) as PublicodesSurfacesDistribution;
};

const SiteFoncierPublicodesProvider = (props: { children?: ReactNode }) => {
  const setSurfaceSituation = useCallback((values: TSurfacesDistribution) => {
    publicodesEngine.setSituation(formatSurfaceValuesForPublicodes(values));
  }, []);

  const computeTotalSurface = useCallback(() => {
    // TODO: Retourner une erreur si une erreur de calcul est détectée
    return publicodesEngine.evaluate("surface friche").nodeValue as number;
  }, []);

  const value = useMemo(
    () => ({
      computeTotalSurface,
      setSurfaceSituation,
    }),
    [computeTotalSurface, setSurfaceSituation],
  );

  return (
    <SiteFoncierPublicodesContext.Provider value={value}>
      {props.children}
    </SiteFoncierPublicodesContext.Provider>
  );
};
export { SiteFoncierPublicodesContext, SiteFoncierPublicodesProvider };
