import { createContext } from "react";

import {
  EconomicBalanceDetailsName,
  EconomicBalanceMainName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import {
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import {
  SocialImpactDetailsName,
  SocialMainImpactName,
} from "@/features/projects/domain/projectImpactsSocial";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";

type IsClosedState = {
  sectionName: undefined;
  impactName: undefined;
  impactDetailsName: undefined;
};

type IsOpenedState =
  | {
      sectionName: "economic_balance";
      impactName?: EconomicBalanceMainName;
      impactDetailsName?: EconomicBalanceDetailsName;
    }
  | {
      sectionName: "socio_economic";
      impactName?: SocioEconomicMainImpactName;
      impactDetailsName?: SocioEconomicDetailsName;
    }
  | {
      sectionName: "social";
      impactName?: SocialMainImpactName;
      impactDetailsName?: SocialImpactDetailsName;
    }
  | {
      sectionName: "environmental";
      impactName?: EnvironmentalMainImpactName;
      impactDetailsName?: EnvironmentalImpactDetailsName;
    }
  | {
      sectionName: "summary";
      impactData: KeyImpactIndicatorData;
    };

export type OpenState = IsClosedState | IsOpenedState;

export type OpenImpactModalDescriptionArgs = OpenState;

type Context = {
  openState: OpenState;
  openImpactModalDescription: (args: OpenImpactModalDescriptionArgs) => void;
  resetOpenState: () => void;
};

export const INITIAL_OPEN_STATE = {
  sectionName: undefined,
  impactName: undefined,
  impactDetailsName: undefined,
};

export const ImpactModalDescriptionContext = createContext<Context>({
  openState: INITIAL_OPEN_STATE,
  openImpactModalDescription: () => {},
  resetOpenState: () => {},
});
