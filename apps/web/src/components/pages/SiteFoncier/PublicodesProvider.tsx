import { createContext, useMemo, ReactNode, useCallback } from "react";

import PublicodesEngine from "publicodes";
import rules from "publicodes-rules";

const SURFACES_CATEGORIES_CORRELATION = {
  production: "espaces . anciens sites de production",
  storage: "espaces . anciens espaces de stockage",
  quarry: "espaces . ancienne carrière",
  buildings: "espaces . autres bâtiments",
  concrete_car_park: "espaces . parking ou VRD bétonnisé",
  gravel_car_park: "espaces . parking ou VRD gravier",
  other_sealed_surface: "espaces . autre surface imperméabilisée",
  non_vegetated_permeable_surface:
    "espaces . autre suface non végétalisée perméable",
  vegetated_surface: "espaces . surface végétalisée",
  open_ground: "espaces . pleine terre",
  body_of_water: "espaces . plan d’eau",
  other: "espaces . autre",
} as const;

export type TSurfaceCategory = keyof typeof SURFACES_CATEGORIES_CORRELATION;

export type TSurfacesDistribution = Partial<Record<TSurfaceCategory, string>>;

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
  const publicodesArray = Object.entries(values).map(([key, value]) => {
    const newKey = SURFACES_CATEGORIES_CORRELATION[key as TSurfaceCategory];
    return [newKey, `${value || 0}m2`];
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
