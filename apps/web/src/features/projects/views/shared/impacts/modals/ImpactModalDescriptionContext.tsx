import { createContext } from "react";

import {
  EconomicBalanceDetailsName,
  EconomicBalanceMainName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
} from "@/features/projects/core/projectImpactsEnvironmental";
import {
  SocialImpactDetailsName,
  SocialMainImpactName,
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
