import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  useCallback,
} from "react";

import {
  SiteKindsType,
  SurfaceKindsType,
  SurfacesDistributionType,
} from "../constants";

type DataTypes = {
  kind?: SiteKindsType | undefined;
  name?: string;
  description?: string;
  location?: {
    lat?: number;
    long?: number;
    address: string;
  };
};

export type FormDataProvider = {
  surfaceKinds: Array<SurfaceKindsType>;
  kind: SiteKindsType | undefined;
  setKind: (kind: SiteKindsType) => void;
  setSurfaceKinds: Dispatch<React.SetStateAction<Array<SurfaceKindsType>>>;
  address: string | undefined;
  setAddress: (address: string) => void;
  surfacesDistribution: SurfacesDistributionType;
  setSurfacesDistribution: Dispatch<
    React.SetStateAction<SurfacesDistributionType>
  >;
};

const DEFAULT_VALUES = {
  surfaceKinds: [],
  kind: undefined,
  setKind: () => undefined,
  setSurfaceKinds: () => undefined,
  address: undefined,
  setAddress: () => undefined,
  surfacesDistribution: {},
  setSurfacesDistribution: () => undefined,
};

const FormDataContext = createContext<FormDataProvider>(DEFAULT_VALUES);

const FormDataProvider = (props: { children?: ReactNode }) => {
  const [data, setData] = useState<DataTypes>(DEFAULT_VALUES);
  // TODO: Fusionner surfaceKinds et surfacesDistribution
  const [surfaceKinds, setSurfaceKinds] = useState<Array<SurfaceKindsType>>([]);
  const [surfacesDistribution, setSurfacesDistribution] =
    useState<SurfacesDistributionType>({});

  const setKind = useCallback((kind: SiteKindsType) => {
    setData((currentValue) => ({ ...currentValue, kind }));
  }, []);

  const setAddress = useCallback((address: string) => {
    setData((currentValue) => ({ ...currentValue, location: { address } }));
  }, []);

  return (
    <FormDataContext.Provider
      value={{
        kind: data.kind,
        setKind,
        surfaceKinds,
        setSurfaceKinds,
        setAddress,
        surfacesDistribution,
        setSurfacesDistribution,
        address: data.location?.address,
      }}
    >
      {props.children}
    </FormDataContext.Provider>
  );
};
export { FormDataContext, FormDataProvider };
