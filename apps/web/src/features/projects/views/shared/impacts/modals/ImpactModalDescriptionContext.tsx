import { createContext } from "react";
import { Link } from "type-route";

import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";

import {
  SECTION_CODES,
  SECTION_CODES_REVERSE,
  ECONOMIC_BALANCE_DETAILS_CODES,
  ECONOMIC_BALANCE_DETAILS_CODES_REVERSE,
  SOCIO_ECO_DETAILS_CODES,
  SOCIAL_DETAILS_CODES,
  ENVIRONMENTAL_DETAILS_CODES,
  SectionCode,
  DetailsCode,
  SOCIO_ECO_DETAILS_CODES_REVERSE,
  SOCIAL_DETAILS_CODES_REVERSE,
  ENVIRONMENTAL_DETAILS_CODES_REVERSE,
  SUMMARY_DETAILS_CODES_REVERSE,
  SUMMARY_DETAILS_CODES,
} from "./impactModalUrlCodes";

type IsClosedState = {
  sectionName: undefined;
  impactDetailsName: undefined;
};

export type SocioEconomicSectionName =
  | "socioEconomic"
  | "socioEconomic.humanity"
  | "socioEconomic.localPeopleOrCompany"
  | "socioEconomic.localAuthority";

export type SocialSectionName =
  | "social"
  | "social.jobs"
  | "social.humanity"
  | "social.localPeopleOrCompany";

export type EnvironmentalSectionName =
  | "environmental"
  | "environmental.co2eq"
  | "environmental.soils";

type IsOpenedState =
  | {
      sectionName: "economicBalance";
      impactDetailsName?: EconomicBalanceImpactKeyName;
    }
  | {
      sectionName: SocioEconomicSectionName;
      impactDetailsName?: SocioEconomicImpactImpactKeyName;
    }
  | {
      sectionName: SocialSectionName;
      impactDetailsName?: SocialImpactMetricKeyName;
    }
  | {
      sectionName: EnvironmentalSectionName;
      impactDetailsName?: EnvironmentalImpactMetricKeyName;
    }
  | {
      sectionName: "summary";
      impactDetailsName?: KeyImpactIndicatorData["name"];
    }
  | {
      sectionName: "breakEvenLevel";
    };

export type ContentState = IsClosedState | IsOpenedState;

export type UpdateModalContentArgs = ContentState;
export const INITIAL_CONTENT_STATE = {
  sectionName: undefined,
  impactDetailsName: undefined,
} satisfies ContentState;

const SEPARATOR = "_";
const DETAILS_CODES_BY_SECTION: Record<
  Exclude<ContentState["sectionName"], undefined>,
  Record<string, string> | undefined
> = {
  economicBalance: ECONOMIC_BALANCE_DETAILS_CODES,
  socioEconomic: SOCIO_ECO_DETAILS_CODES,
  "socioEconomic.humanity": SOCIO_ECO_DETAILS_CODES,
  "socioEconomic.localPeopleOrCompany": SOCIO_ECO_DETAILS_CODES,
  "socioEconomic.localAuthority": SOCIO_ECO_DETAILS_CODES,
  social: SOCIAL_DETAILS_CODES,
  "social.humanity": SOCIAL_DETAILS_CODES,
  "social.jobs": SOCIAL_DETAILS_CODES,
  "social.localPeopleOrCompany": SOCIAL_DETAILS_CODES,
  environmental: ENVIRONMENTAL_DETAILS_CODES,
  "environmental.co2eq": ENVIRONMENTAL_DETAILS_CODES,
  "environmental.soils": ENVIRONMENTAL_DETAILS_CODES,
  summary: SUMMARY_DETAILS_CODES,
  breakEvenLevel: undefined,
} as const;

export function serializeContentState(state: ContentState): string {
  if (!state.sectionName) return "";

  const detailsCodes = DETAILS_CODES_BY_SECTION[state.sectionName];
  const detailsCode =
    "impactDetailsName" in state && state.impactDetailsName
      ? detailsCodes?.[state.impactDetailsName]
      : undefined;

  return [SECTION_CODES[state.sectionName], detailsCode].filter(Boolean).join(SEPARATOR);
}

type SplitKey<K extends string> = K extends `${SectionCode}_${DetailsCode}`
  ? [SectionCode, DetailsCode]
  : [K];

const splitDetailsKey = <K extends string>(key: K): SplitKey<K> => {
  return key.split("_") as SplitKey<K>;
};

export function parseContentState(
  contenu: `${SectionCode}_${DetailsCode}` | undefined,
): ContentState {
  if (!contenu) return INITIAL_CONTENT_STATE;

  const [sectionCode, impactDetailsCode] = splitDetailsKey(contenu);
  if (!sectionCode) {
    return {
      sectionName: undefined,
      impactDetailsName: undefined,
    };
  }

  const sectionName = SECTION_CODES_REVERSE[sectionCode];

  if (!sectionName) return INITIAL_CONTENT_STATE;

  switch (sectionName) {
    case "economicBalance": {
      const keyName = ECONOMIC_BALANCE_DETAILS_CODES_REVERSE[impactDetailsCode];
      if (!keyName) {
        return { sectionName };
      }
      return {
        sectionName,
        impactDetailsName: keyName,
      };
    }
    case "socioEconomic":
    case "socioEconomic.humanity":
    case "socioEconomic.localPeopleOrCompany":
    case "socioEconomic.localAuthority": {
      const keyName = SOCIO_ECO_DETAILS_CODES_REVERSE[impactDetailsCode];
      return {
        sectionName,
        impactDetailsName: keyName,
      };
    }
    case "social":
    case "social.humanity":
    case "social.jobs":
    case "social.localPeopleOrCompany": {
      const keyName = SOCIAL_DETAILS_CODES_REVERSE[impactDetailsCode];
      return {
        sectionName,
        impactDetailsName: keyName,
      };
    }
    case "environmental":
    case "environmental.co2eq":
    case "environmental.soils": {
      const keyName = ENVIRONMENTAL_DETAILS_CODES_REVERSE[impactDetailsCode];
      return {
        sectionName,
        impactDetailsName: keyName,
      };
    }
    case "breakEvenLevel":
      return { sectionName };
    case "summary":
      return { sectionName, impactDetailsName: SUMMARY_DETAILS_CODES_REVERSE[impactDetailsCode] };
    default:
      return INITIAL_CONTENT_STATE;
  }
}

type Context = {
  contentState: ContentState;
  onClose: () => void;
  getDetailsLink: (args: UpdateModalContentArgs) => Link | undefined;
  dialogTitleId: string;
};

export const ImpactModalDescriptionContext = createContext<Context>({
  contentState: INITIAL_CONTENT_STATE,
  onClose: () => {},
  dialogTitleId: "",
  getDetailsLink: () => {
    return undefined;
  },
});
