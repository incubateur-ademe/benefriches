import {
  useState,
  createContext,
  useMemo,
  ReactNode,
  Dispatch,
  useCallback,
} from "react";
import { SITE_KINDS, SpaceKindsType } from "../constants";

import PublicodesEngine from "publicodes";
import rules from "publicodes-rules";

const publicodesEngine = new PublicodesEngine(rules);

// interface FormData {
//   type: "friche" | "prairie" | "forêt" | "terre agricole";
//   name: string;
//   description: string;
//   location: {
//     lat: number;
//     long: number;
//     address: string;
//   };
//   last_activity: "industrielle" | "militaire" | "portuaire" | "commerciale" | "ferroviaire" | "équipement public" | "agricole" | "habitat" | "autre";
//   spaces: {
//     production: number;
//     storage: number;
//     quarry: number;
//     buildings: number;
//     concrete_car_park: number;
//     gravel_car_park: number;
//     other_sealed_surface: number;
//     non_vegetated_permeable_surface: number;
//     vegetated_surface: number;
//     open_ground: number;
//     body_of_water: number;
//     other: number;
//   };
//   pollution: {
//     amiante: boolean;
//     metaux_lourds: {
//       production: number;
//       storage: number;
//       quarry: number;
//       buildings: number;
//       concrete_car_park: number;
//       gravel_car_park: number;
//       other_sealed_surface: number;
//       non_vegetated_permeable_surface: number;
//       vegetated_surface: number;
//       open_ground: number;
//       body_of_water: number;
//       other: number;
//     };
//     hydrocarbures: {
//       production: number;
//       storage: number;
//       quarry: number;
//       buildings: number;
//       concrete_car_park: number;
//       gravel_car_park: number;
//       other_sealed_surface: number;
//       non_vegetated_permeable_surface: number;
//       vegetated_surface: number;
//       open_ground: number;
//       body_of_water: number;
//       other: number;
//     };
//   };
//   administration: {
//     kind: "collectivité" | "mon entreprise" | "entreprise tierce" | "other";
//     name: string;
//     costs: {
//       gardien: number;
//       entretien: number;
//       savage_garbage: number;
//       accidents: number;
//       water_traitment: number;
//       inondation: number;
//     };
//     accidents: {
//       light_wounded: number;
//       bad_wounded: number;
//       killed: number;
//     };
//   };
// }

type KindType = (typeof SITE_KINDS)[number] | null | undefined;
export type AddressType = string | null | undefined;
type DataTypes = {
  kind?: KindType;
  name?: string;
  description?: string;
  location?: {
    lat?: number;
    long?: number;
    address: AddressType;
  };
};

export type FormDataProvider = {
  spacesKinds: Array<SpaceKindsType>;
  kind: KindType;
  setKind: (kind: KindType) => void;
  setSpacesKinds: Dispatch<React.SetStateAction<Array<SpaceKindsType>>>;
  address: AddressType;
  setAddress: (address: AddressType) => void;
  publicodesEngine: PublicodesEngine;
};

const FormDataContext = createContext<FormDataProvider>({
  spacesKinds: [],
  kind: null,
  setKind: () => null,
  setSpacesKinds: () => null,
  address: null,
  setAddress: () => null,
  publicodesEngine,
});

const FormDataProvider = (props: { children?: ReactNode }) => {
  const [data, setData] = useState<DataTypes>({});
  const [spacesKinds, setSpacesKinds] = useState<Array<SpaceKindsType>>([]);

  const setKind = useCallback((kind: KindType) => {
    setData((currentValue) => ({ ...currentValue, kind }));
  }, []);

  const setAddress = useCallback((address: AddressType) => {
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
      publicodesEngine,
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
