import type { Link } from "type-route";

import type { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import type { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import type { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import type { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";

import {
  getEconomicBalanceImpactLabel,
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../shared/getImpactLabel";
import type {
  ContentState,
  EnvironmentalSectionName,
  SocialSectionName,
  SocioEconomicSectionName,
  UpdateModalContentArgs,
} from "./ImpactModalDescriptionContext";
import type { SplitKey } from "./getImpactData";
import { splitImpactKey } from "./getImpactData";
import type { BreadcrumbProps, BreadcrumbSegment } from "./modal-layout/ModalBreadcrumb";

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
  getLink,
}: {
  impactDetailsName?: DetailsName;
  getLabel: (key: DetailsName | SplitKey<DetailsName>[0]) => string;
  getLink: (impactDetailsName: SplitKey<DetailsName>[0]) => Link | undefined;
}): (BreadcrumbSegment | undefined)[] {
  if (!impactDetailsName) {
    return [];
  }
  const [impactName, details] = splitImpactKey(impactDetailsName);

  return [
    details && {
      label: getLabel(impactName),
      linkProps: getLink(impactName),
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
        "economicBalance" | SocioEconomicSectionName | EnvironmentalSectionName | SocialSectionName;
    }
  >,
  getLink: (args: UpdateModalContentArgs) => Link | undefined,
): BreadcrumbProps["segments"] => {
  switch (contentState.sectionName) {
    case "socioEconomic":
    case "socioEconomic.humanity":
    case "socioEconomic.localAuthority":
    case "socioEconomic.localPeopleOrCompany": {
      const [, subSection] = splitImpactKey(contentState.sectionName);

      const subSectionSegment = subSection
        ? {
            label: SOCIO_ECONOMIC_BREADCRUMBS[subSection].label,
            linkProps: getLink(SOCIO_ECONOMIC_BREADCRUMBS[subSection].contentState),
          }
        : undefined;

      return [
        {
          label: "Impacts socio-économiques",
          linkProps: getLink({ sectionName: "socioEconomic" }),
        },
        ...buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getSocioEconomicImpactLabel,
            getLink: (impactDetailsName) =>
              getLink({
                sectionName: contentState.sectionName,
                impactDetailsName,
              }),
          }),
        ]),
      ];
    }

    case "social":
    case "social.humanity":
    case "social.localPeopleOrCompany":
    case "social.jobs": {
      const [, subSection] = splitImpactKey(contentState.sectionName);

      const subSectionSegment = subSection
        ? {
            label: SOCIAL_BREADCRUMBS[subSection].label,
            linkProps: getLink(SOCIAL_BREADCRUMBS[subSection].contentState),
          }
        : undefined;
      return [
        {
          label: "Impacts sociaux",
          linkProps: getLink({ sectionName: "social" }),
        },
        ...buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getSocialImpactLabel,
            getLink: (impactDetailsName) =>
              getLink({
                sectionName: contentState.sectionName,
                impactDetailsName,
              }),
          }),
        ]),
      ];
    }

    case "environmental":
    case "environmental.soils":
    case "environmental.co2eq": {
      const [, subSection] = splitImpactKey(contentState.sectionName);

      const subSectionSegment = subSection
        ? {
            label: ENVIRONMENTAL_BREADCRUMBS[subSection].label,
            linkProps: getLink(ENVIRONMENTAL_BREADCRUMBS[subSection].contentState),
          }
        : undefined;
      return [
        {
          label: "Impacts environnementaux",
          linkProps: getLink({ sectionName: "environmental" }),
        },
        ...buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getEnvironmentalImpactLabel,
            getLink: (impactDetailsName) =>
              getLink({
                sectionName: contentState.sectionName,
                impactDetailsName,
              }),
          }),
        ]),
      ];
    }

    case "economicBalance":
      return [
        {
          label: "Bilan de l'opération",
          linkProps: getLink({ sectionName: "economicBalance" }),
        },
        ...buildCascadingBreadcrumb(
          buildImpactSegments({
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getEconomicBalanceImpactLabel,
            getLink: (impactDetailsName) =>
              getLink({
                sectionName: contentState.sectionName,
                impactDetailsName,
              }),
          }),
        ),
      ];
  }
};
