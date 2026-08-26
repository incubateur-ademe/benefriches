import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";

import {
  getEconomicBalanceImpactLabel,
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../shared/getImpactLabel";
import {
  ContentState,
  EnvironmentalSectionName,
  SocialSectionName,
  SocioEconomicSectionName,
} from "./ImpactModalDescriptionContext";
import { splitImpactKey, SplitKey } from "./getImpactData";
import { BreadcrumbSegment } from "./modal-layout/ModalBreadcrumb";

function buildCascadingBreadcrumb(levels: (BreadcrumbSegment | undefined)[]): BreadcrumbSegment[] {
  return levels.filter((level): level is BreadcrumbSegment => level !== undefined);
}

function buildImpactSegments<
  DetailsName extends
    | SocioEconomicImpactImpactKeyName
    | EnvironmentalImpactMetricKeyName
    | SocialImpactMetricKeyName
    | EconomicBalanceImpactKeyName,
>({
  impactDetailsName,
  getLabel,
  getImpactContentState,
}: {
  impactDetailsName?: DetailsName;
  getLabel: (key: DetailsName | SplitKey<DetailsName>[0]) => string;
  getImpactContentState: (impactDetailsName: SplitKey<DetailsName>[0]) => ContentState;
}): (BreadcrumbSegment | undefined)[] {
  if (!impactDetailsName) {
    return [];
  }
  const [impactName, details] = splitImpactKey(impactDetailsName);

  return [
    details && {
      label: getLabel(impactName),
      contentState: getImpactContentState(impactName),
    },
    { label: getLabel(impactDetailsName) },
  ];
}

const SOCIO_ECONOMIC_BREADCRUMBS = {
  humanity: {
    label: "Impacts pour la société française et mondiale",
    contentState: { sectionName: "socioEconomic.humanity" },
  },
  localPeopleOrCompany: {
    label: "Impacts pour les riverains",
    contentState: { sectionName: "socioEconomic.localPeopleOrCompany" },
  },
  localAuthority: {
    label: "Impacts pour la collectivité locale",
    contentState: { sectionName: "socioEconomic.localAuthority" },
  },
} as const;

const SOCIAL_BREADCRUMBS = {
  jobs: {
    label: "Impacts sur l'emploi",
    contentState: { sectionName: "social.jobs" },
  },
  localPeopleOrCompany: {
    label: "Impacts sur la population locale",
    contentState: { sectionName: "social.localPeopleOrCompany" },
  },
  humanity: {
    label: "Impacts sur la société française",
    contentState: { sectionName: "social.humanity" },
  },
} as const;

const ENVIRONMENTAL_BREADCRUMBS = {
  soils: {
    label: "Impacts sur les sols",
    contentState: { sectionName: "environmental.soils" },
  },
  co2eq: {
    label: "Impacts sur le CO2-eq",
    contentState: { sectionName: "environmental.co2eq" },
  },
} as const;

export const getBreadcrumbProps = (
  contentState: Extract<
    ContentState,
    {
      sectionName:
        | "economicBalance"
        | SocioEconomicSectionName
        | EnvironmentalSectionName
        | SocialSectionName;
    }
  >,
) => {
  switch (contentState.sectionName) {
    case "socioEconomic":
    case "socioEconomic.humanity":
    case "socioEconomic.localAuthority":
    case "socioEconomic.localPeopleOrCompany": {
      const [, subSection] = splitImpactKey(contentState.sectionName);

      const subSectionSegment = subSection ? SOCIO_ECONOMIC_BREADCRUMBS[subSection] : undefined;

      return {
        section: {
          label: "Impacts socio-économiques",
          contentState: { sectionName: "socioEconomic" as const },
        },
        segments: buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getSocioEconomicImpactLabel,
            getImpactContentState: (impactDetailsName) => ({
              sectionName: contentState.sectionName,
              impactDetailsName,
            }),
          }),
        ]),
      };
    }

    case "social":
    case "social.humanity":
    case "social.localPeopleOrCompany":
    case "social.jobs": {
      const [, subSection] = splitImpactKey(contentState.sectionName);

      const subSectionSegment = subSection ? SOCIAL_BREADCRUMBS[subSection] : undefined;

      return {
        section: {
          label: "Impacts sociaux",
          contentState: { sectionName: "social" as const },
        },
        segments: buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getSocialImpactLabel,
            getImpactContentState: (impactDetailsName) => ({
              sectionName: contentState.sectionName,
              impactDetailsName,
            }),
          }),
        ]),
      };
    }

    case "environmental":
    case "environmental.soils":
    case "environmental.co2eq": {
      const [, subSection] = splitImpactKey(contentState.sectionName);

      const subSectionSegment = subSection ? ENVIRONMENTAL_BREADCRUMBS[subSection] : undefined;

      return {
        section: {
          label: "Impacts environnementaux",
          contentState: { sectionName: "environmental" as const },
        },
        segments: buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getEnvironmentalImpactLabel,
            getImpactContentState: (impactDetailsName) => ({
              sectionName: contentState.sectionName,
              impactDetailsName,
            }),
          }),
        ]),
      };
    }

    case "economicBalance":
      return {
        section: {
          label: "Bilan de l'opération",
          contentState: { sectionName: "economicBalance" as const },
        },
        segments: buildCascadingBreadcrumb(
          buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getEconomicBalanceImpactLabel,
            getImpactContentState: (impactDetailsName) => ({
              sectionName: contentState.sectionName,
              impactDetailsName,
            }),
          }),
        ),
      };
  }
};
