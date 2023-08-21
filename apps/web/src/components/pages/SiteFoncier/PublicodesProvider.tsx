import { createContext, useMemo, ReactNode, useCallback } from "react";

import PublicodesEngine from "publicodes";
import rules from "publicodes-rules";
import { SPACES_KINDS, SpaceKindsType } from "./constants";

const publicodesEngine = new PublicodesEngine(rules);

type FormSpacesSizes = Record<SpaceKindsType, string>;
type PublicodesKeys = (typeof SPACES_KINDS)[SpaceKindsType]["publicodeKey"];
type PublicodesSpacesSizes = Record<PublicodesKeys, string>;

type SiteFoncierPublicodesProvider = {
  computeTotalSurface: () => number;
  setSpacesSituation: (values: FormSpacesSizes) => void;
};

const SiteFoncierPublicodesContext =
  createContext<SiteFoncierPublicodesProvider>({
    computeTotalSurface: () => 0,
    setSpacesSituation: () => undefined,
  });

const formatSpacesValuesForPublicodes = (
  values: FormSpacesSizes,
): PublicodesSpacesSizes => {
  const publicodesArray = Object.entries(values).map(([key, value]) => {
    const newKey = SPACES_KINDS[key as SpaceKindsType].publicodeKey;
    return [newKey, `${value || 0}m2`];
  });
  return Object.fromEntries(publicodesArray) as PublicodesSpacesSizes;
};

const SiteFoncierPublicodesProvider = (props: { children?: ReactNode }) => {
  const setSpacesSituation = useCallback((values: FormSpacesSizes) => {
    publicodesEngine.setSituation(formatSpacesValuesForPublicodes(values));
  }, []);

  const computeTotalSurface = useCallback(() => {
    return publicodesEngine.evaluate("surface friche").nodeValue as number;
  }, []);

  const value = useMemo(
    () => ({
      computeTotalSurface,
      setSpacesSituation,
    }),
    [computeTotalSurface, setSpacesSituation],
  );

  return (
    <SiteFoncierPublicodesContext.Provider value={value}>
      {props.children}
    </SiteFoncierPublicodesContext.Provider>
  );
};
export { SiteFoncierPublicodesContext, SiteFoncierPublicodesProvider };
