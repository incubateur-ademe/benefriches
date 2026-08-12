import { createContext } from "react";

import {
  EconomicBalanceDetailsImpactKeyName,
  EconomicBalanceMainImpactKeyName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
} from "@/features/projects/core/projectImpactsEnvironmental";
import {
  SocialImpactMetricDetailsKeyName,
  SocialImpactMetricMainKeyName,
} from "@/features/projects/core/projectImpactsSocial";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";

type IsClosedState = {
  sectionName: undefined;
  impactName: undefined;
  impactDetailsName: undefined;
};

export type SocioEconomicSubSectionName = "humanity" | "localPeopleOrCompany" | "localAuthority";
export type SocialSubSectionName = "jobs" | "humanity" | "localPeopleOrCompany";
export type EnvironmentSubSectionName = "co2" | "soils";

type IsOpenedState =
  | {
      sectionName: "economic_balance";
      impactName?: EconomicBalanceMainImpactKeyName;
      impactDetailsName?: EconomicBalanceDetailsImpactKeyName;
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
      impactName?: SocialImpactMetricMainKeyName;
      impactDetailsName?: SocialImpactMetricDetailsKeyName;
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
      sectionName: "breakEvenLevel";
    };

export type ContentState = IsClosedState | IsOpenedState;

export type UpdateModalContentArgs = ContentState;

type Context = {
  contentState: ContentState;
  updateModalContent: (args: UpdateModalContentArgs) => void;
  dialogId: string;
  dialogTitleId: string;
};

export const INITIAL_CONTENT_STATE = {
  sectionName: undefined,
  impactName: undefined,
  impactDetailsName: undefined,
};

export const ImpactModalDescriptionContext = createContext<Context>({
  contentState: INITIAL_CONTENT_STATE,
  updateModalContent: () => {},
  dialogId: "",
  dialogTitleId: "",
});
