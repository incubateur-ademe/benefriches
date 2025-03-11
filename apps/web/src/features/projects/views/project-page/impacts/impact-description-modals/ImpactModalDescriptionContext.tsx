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

export type SocioEconomicSubSectionName =
  | "economic_direct"
  | "economic_indirect"
  | "social_monetary"
  | "environmental_monetary";
export type SocialSubSectionName = "jobs" | "french_society" | "local_people";
export type EnvironmentSubSectionName = "co2" | "soils";

type IsOpenedState =
  | {
      sectionName: "economic_balance";
      impactName?: EconomicBalanceMainName;
      impactDetailsName?: EconomicBalanceDetailsName;
    }
  | {
      sectionName: "socio_economic";
      subSectionName?: SocioEconomicSubSectionName;
      impactName?: SocioEconomicMainImpactName;
      impactDetailsName?: SocioEconomicDetailsName;
    }
  | {
      sectionName: "social";
      subSectionName?: SocialSubSectionName;
      impactName?: SocialMainImpactName;
      impactDetailsName?: SocialImpactDetailsName;
    }
  | {
      sectionName: "environmental";
      subSectionName?: EnvironmentSubSectionName;
      impactName?: EnvironmentalMainImpactName;
      impactDetailsName?: EnvironmentalImpactDetailsName;
    }
  | {
      sectionName: "summary";
      impactData: KeyImpactIndicatorData;
    }
  | {
      sectionName: "charts";
      impactName: "cost_benefit_analysis" | "soils_carbon_storage";
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
