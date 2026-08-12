import { ContentState } from "../../../shared/impacts/modals/ImpactModalDescriptionContext";
import { BreadcrumbSegment } from "../../../shared/impacts/modals/ModalBreadcrumb";
import {
  getEconomicBalanceImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../getImpactLabel";

function buildCascadingBreadcrumb(levels: (BreadcrumbSegment | undefined)[]): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];
  for (const level of levels) {
    if (!level) break;
    segments.push(level);
  }
  return segments;
}

function buildImpactSegments<Name extends string, DetailsName extends string>({
  impactName,
  impactDetailsName,
  getLabel,
  getImpactContentState,
}: {
  impactName?: Name;
  impactDetailsName?: DetailsName;
  getLabel: (key: Name | DetailsName) => string;
  getImpactContentState: (impactName: Name) => ContentState;
}): (BreadcrumbSegment | undefined)[] {
  return [
    impactName && {
      label: getLabel(impactName),
      contentState: impactDetailsName ? getImpactContentState(impactName) : undefined,
    },
    impactDetailsName && { label: getLabel(impactDetailsName) },
  ];
}

const SOCIO_ECONOMIC_BREADCRUMBS = {
  humanity: {
    label: "Impacts pour la société française et mondiale",
    contentState: { sectionName: "socio_economic", subSectionName: "humanity" },
  },

  localPeopleOrCompany: {
    label: "Impacts pour les riverains",
    contentState: { sectionName: "socio_economic", subSectionName: "localPeopleOrCompany" },
  },

  localAuthority: {
    label: "Impacts pour la collectivité locale",
    contentState: { sectionName: "socio_economic", subSectionName: "localAuthority" },
  },
} as const;

const SOCIAL_BREADCRUMBS = {
  jobs: {
    label: "Impacts sur l'emploi",
    contentState: { sectionName: "social", subSectionName: "jobs" },
  },

  localPeopleOrCompany: {
    label: "Impacts sur la population locale",
    contentState: { sectionName: "social", subSectionName: "localPeopleOrCompany" },
  },

  humanity: {
    label: "Impacts sur la société française",
    contentState: { sectionName: "social", subSectionName: "humanity" },
  },
} as const;

export const getBreadcrumbProps = (
  contentState: Extract<
    ContentState,
    { sectionName: "socio_economic" | "social" | "economic_balance" }
  >,
) => {
  switch (contentState.sectionName) {
    case "socio_economic": {
      const subSectionSegment = contentState.subSectionName
        ? SOCIO_ECONOMIC_BREADCRUMBS[contentState.subSectionName]
        : undefined;

      return {
        section: {
          label: "Impacts socio-économiques",
          contentState: { sectionName: contentState.sectionName },
        },
        segments: buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactName: contentState.impactName,
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getSocioEconomicImpactLabel,
            getImpactContentState: (impactName) => ({
              sectionName: contentState.sectionName,
              subSectionName: contentState.subSectionName,
              impactName,
            }),
          }),
        ]),
      };
    }

    case "social": {
      const subSectionSegment = contentState.subSectionName
        ? SOCIAL_BREADCRUMBS[contentState.subSectionName]
        : undefined;

      return {
        section: {
          label: "Impacts sociaux",
          contentState: { sectionName: contentState.sectionName },
        },
        segments: buildCascadingBreadcrumb([
          subSectionSegment,
          ...buildImpactSegments({
            impactName: contentState.impactName,
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getSocialImpactLabel,
            getImpactContentState: (impactName) => ({
              sectionName: contentState.sectionName,
              subSectionName: contentState.subSectionName,
              impactName,
            }),
          }),
        ]),
      };
    }

    case "economic_balance":
      return {
        section: {
          label: "Bilan de l'opération",
          contentState: { sectionName: contentState.sectionName },
        },
        segments: buildCascadingBreadcrumb(
          buildImpactSegments({
            impactName: contentState.impactName,
            impactDetailsName: contentState.impactDetailsName,
            getLabel: getEconomicBalanceImpactLabel,
            getImpactContentState: (impactName) => ({
              sectionName: contentState.sectionName,
              impactName,
            }),
          }),
        ),
      };
  }
};
