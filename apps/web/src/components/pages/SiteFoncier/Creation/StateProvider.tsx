import {
  useState,
  createContext,
  useMemo,
  ReactNode,
  Dispatch,
  useCallback,
} from "react";
import { SiteKindsType, SpaceKindsType } from "../constants";

type DataTypes = {
  kind?: SiteKindsType | null | undefined;
  name?: string;
  description?: string;
  location?: {
    lat?: number;
    long?: number;
    address: string;
  };
};

export type FormDataProvider = {
  spacesKinds: Array<SpaceKindsType>;
  kind: SiteKindsType | null | undefined;
  setKind: (kind: SiteKindsType) => void;
  setSpacesKinds: Dispatch<React.SetStateAction<Array<SpaceKindsType>>>;
  address: string | null | undefined;
  setAddress: (address: string) => void;
};

const DEFAULT_VALUES = {
  spacesKinds: [],
  kind: null,
  setKind: () => null,
  setSpacesKinds: () => null,
  address: null,
  setAddress: () => null,
};

const FormDataContext = createContext<FormDataProvider>(DEFAULT_VALUES);

const FormDataProvider = (props: { children?: ReactNode }) => {
  const [data, setData] = useState<DataTypes>(DEFAULT_VALUES);
  const [spacesKinds, setSpacesKinds] = useState<Array<SpaceKindsType>>([]);

  const setKind = useCallback((kind: SiteKindsType) => {
    setData((currentValue) => ({ ...currentValue, kind }));
  }, []);

  const setAddress = useCallback((address: string) => {
    setData((currentValue) => ({ ...currentValue, location: { address } }));
  }, []);

  const formDataValue = useMemo(
    () => ({
      kind: data.kind,
      setKind,
      spacesKinds,
      setSpacesKinds,
      setAddress,
      address: data.location?.address,
    }),
    [data.kind, data.location?.address, setAddress, setKind, spacesKinds],
  );

  return (
    <FormDataContext.Provider value={formDataValue}>
      {props.children}
    </FormDataContext.Provider>
  );
};
export { FormDataContext, FormDataProvider };
