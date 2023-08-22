import { createContext, useMemo, ReactNode, useCallback } from "react";

import PublicodesEngine from "publicodes";
import rules from "publicodes-rules";
import {
  SURFACE_KINDS,
  SurfaceKindsType,
  SurfacesDistributionType,
} from "./constants";

const publicodesEngine = new PublicodesEngine(rules);

type PublicodesKeys = (typeof SURFACE_KINDS)[SurfaceKindsType]["publicodeKey"];
type PublicodesSurfacesDistribution = Record<PublicodesKeys, string>;

type SiteFoncierPublicodesProvider = {
  computeTotalSurface: () => number;
  setSurfaceSituation: (values: SurfacesDistributionType) => void;
};

const SiteFoncierPublicodesContext =
  createContext<SiteFoncierPublicodesProvider>({
    computeTotalSurface: () => 0,
    setSurfaceSituation: () => undefined,
  });

const formatSurfaceValuesForPublicodes = (
  values: SurfacesDistributionType,
): PublicodesSurfacesDistribution => {
  const publicodesArray = Object.entries(values).map(([key, value]) => {
    const newKey = SURFACE_KINDS[key as SurfaceKindsType].publicodeKey;
    return [newKey, `${value || 0}m2`];
  });
  return Object.fromEntries(publicodesArray) as PublicodesSurfacesDistribution;
};

const SiteFoncierPublicodesProvider = (props: { children?: ReactNode }) => {
  const setSurfaceSituation = useCallback(
    (values: SurfacesDistributionType) => {
      publicodesEngine.setSituation(formatSurfaceValuesForPublicodes(values));
    },
    [],
  );

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
