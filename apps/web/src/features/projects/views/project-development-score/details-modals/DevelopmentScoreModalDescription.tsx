import { useMemo } from "react";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";

import type {
  ContentState,
  UpdateModalContentArgs,
} from "../../impact-description-modals/ImpactModalDescriptionContext";
import { getBreadcrumbProps } from "../../impact-description-modals/breadcrumb";
import MdxContentDialog from "../../impact-description-modals/lazy-component/MdxContentDialog";
import type { BreadcrumbProps } from "../../impact-description-modals/modal-layout/ModalBreadcrumb";
import type { ModalHeaderDataProps } from "../../impact-description-modals/modal-layout/ModalHeader";
import useImpactListModalContent from "../../impact-description-modals/useImpactListModalContent";
import useToggleDescriptionModal from "../../impact-description-modals/useToggleDescriptionModal";
import { developmentScoreMdxComponents } from "../../shared/impacts/documentation/mdxComponents";
import DevelopmentScoreModalLink from "./DevelopmentScoreModalLink";
import { DEVELOPMENT_SCORE_CONFIG_MODALS } from "./developmentScoreModalsConfig";
import { type DetailsName, parseDetails, serializeDetails } from "./useOpenDescriptionModalLink";

type Props = {
  routeParamsDetails?: string;
  getUpdateRouteDetailsFn: (details?: string) => { link: Link; push: () => void };
  developmentScore: DevelopmentScoreDataView["developmentScore"];
  modalsData: DevelopmentScoreDataView["modalsData"];
  disableExport?: boolean;
};

const FAMILY_LABELS = {
  localAuthorityEconomicScore: "Finances publiques",
  fullTimeJobsScore: "Emploi",
  environmentScore: "Environnement",
  localPeopleQualityOfLifeScore: "Qualité de vie des riverains",
} as const satisfies Partial<Record<DetailsName, string>>;

const BREADCRUMB_DETAILS: Partial<
  Record<DetailsName, { parent: keyof typeof FAMILY_LABELS; label: string }>
> = {
  "environmentScore.co2eqEmissionsVariation": {
    parent: "environmentScore",
    label: "Émissions de CO2eq",
  },
  "environmentScore.ecosystemServices": {
    parent: "environmentScore",
    label: "Services écosystèmiques",
  },
  "environmentScore.soilsQuality": { parent: "environmentScore", label: "Qualité des sols" },
  "environmentScore.waterQuality": { parent: "environmentScore", label: "Qualité de l'eau" },
  "environmentScore.zanCompliance": { parent: "environmentScore", label: "Objectif ZAN" },
  "localPeopleQualityOfLifeScore.accessToHealthCare": {
    parent: "localPeopleQualityOfLifeScore",
    label: "Accès aux soins",
  },
  "localPeopleQualityOfLifeScore.accessToLocalServices": {
    parent: "localPeopleQualityOfLifeScore",
    label: "Accès aux services",
  },
  "localPeopleQualityOfLifeScore.frichesAccidents": {
    parent: "localPeopleQualityOfLifeScore",
    label: "Sécurité des riverains",
  },
  "localPeopleQualityOfLifeScore.livingEnvironment": {
    parent: "localPeopleQualityOfLifeScore",
    label: "Cadre de vie",
  },
  "localPeopleQualityOfLifeScore.localHealthiness": {
    parent: "localPeopleQualityOfLifeScore",
    label: "Santé",
  },
  "localPeopleQualityOfLifeScore.trafficSecurity": {
    parent: "localPeopleQualityOfLifeScore",
    label: "Sécurité routière",
  },
};

const SECTION_PARENT_MAP: Map<ContentState["sectionName"], keyof typeof FAMILY_LABELS> = new Map([
  ["social.jobs", "fullTimeJobsScore"],
  ["environmental.co2eq", "environmentScore"],
  ["socioEconomic.humanity", "environmentScore"],
  ["socioEconomic.localAuthority", "localAuthorityEconomicScore"],
]);

const getBreadcrumbsSegments = (
  detailsName: DetailsName | undefined,
  contentState: ContentState,
  getLink: (detailsName: DetailsName) => Link,
  getListLink: (args: UpdateModalContentArgs) => Link | undefined,
): BreadcrumbProps["segments"] | undefined => {
  const mainSegment = { label: "Score d'impact", linkProps: getLink("global") };

  const parentSegment = (name: keyof typeof FAMILY_LABELS) => ({
    label: FAMILY_LABELS[name],
    linkProps: getLink(name),
  });

  // Page de score
  const { sectionName } = contentState;
  if (sectionName && sectionName !== "breakEvenLevel") {
    const parentName = SECTION_PARENT_MAP.get(sectionName);
    return [
      mainSegment,
      ...(parentName ? [parentSegment(parentName)] : []),
      ...getBreadcrumbProps(contentState, getListLink),
    ];
  }

  // Page de détails
  if (!detailsName || detailsName === "global") {
    return detailsName ? [mainSegment] : undefined;
  }

  if (detailsName in FAMILY_LABELS) {
    return [mainSegment, parentSegment(detailsName as keyof typeof FAMILY_LABELS)];
  }

  const page = BREADCRUMB_DETAILS[detailsName];
  if (page) {
    return [mainSegment, parentSegment(page.parent), { label: page.label }];
  }

  return undefined;
};

function DevelopmentScoreModalDescription({
  developmentScore,
  modalsData,
  routeParamsDetails,
  getUpdateRouteDetailsFn,
  disableExport = false,
}: Props) {
  const detailsName = useMemo(() => parseDetails(routeParamsDetails), [routeParamsDetails]);

  const { getUpdateDetailsLink, getLink } = useMemo(
    () => ({
      getLink: (detailsName?: DetailsName) =>
        getUpdateRouteDetailsFn(detailsName ? serializeDetails(detailsName) : undefined).link,
      getUpdateDetailsLink: (details?: string) => getUpdateRouteDetailsFn(details).link,
    }),
    [getUpdateRouteDetailsFn],
  );

  const config = detailsName ? DEVELOPMENT_SCORE_CONFIG_MODALS[detailsName] : undefined;

  const {
    contentState: impactsListModalsMatchedState,
    getDetailsLink: getImpactListModalContentLink,
  } = useToggleDescriptionModal({ getUpdateRouteDetailsFn, routeParamsDetails });

  const isImpactListDetailsContent =
    impactsListModalsMatchedState.sectionName &&
    impactsListModalsMatchedState.sectionName !== "breakEvenLevel";

  const listDetailsConfig = useImpactListModalContent(
    isImpactListDetailsContent
      ? impactsListModalsMatchedState
      : { sectionName: undefined, impactDetailsName: undefined },
    modalsData,
    getImpactListModalContentLink,
  );

  const WizardComponent = config?.ContentComponent ?? listDetailsConfig?.ContentComponent;
  const letterGrade = config?.letterGrade?.(developmentScore.details);
  const MetricsComponent = config?.MetricsComponent;
  const dataProps =
    config?.dataProps?.({
      developmentScore,
      getUpdateDetailsLink,
      getImpactListModalContentLink,

      modalsData,
    }) ?? listDetailsConfig?.dataProps;

  const badgeKind = (() => {
    switch (detailsName) {
      case "environmentScore.co2eqEmissionsVariation":
      case "fullTimeJobsScore":
        return "evolution";
      case "localAuthorityEconomicScore":
        return "impact";
      case "environmentScore.zanCompliance":
        return "compliance";
      default:
        return "qualitative";
    }
  })();

  if (!WizardComponent) {
    return null;
  }

  const dataPropsWithScore: ModalHeaderDataProps = dataProps
    ? {
        ...dataProps,
        headerProps: {
          ...dataProps?.headerProps,
          score: letterGrade
            ? {
                letterGrade,
                labelKind: badgeKind,
              }
            : undefined,
        },
      }
    : {
        type: "value",
        headerProps: {
          score: letterGrade
            ? {
                letterGrade,
                labelKind: badgeKind,
              }
            : undefined,
        },
      };

  return (
    <MdxContentDialog
      breadcrumbSegments={getBreadcrumbsSegments(
        detailsName,
        impactsListModalsMatchedState,
        getLink,
        getImpactListModalContentLink,
      )}
      modalsData={modalsData}
      routeParamsDetails={routeParamsDetails}
      getUpdateRouteDetailsFn={getUpdateRouteDetailsFn}
      ContentComponent={WizardComponent}
      mdxComponents={{
        ...developmentScoreMdxComponents,
        a: (props) => (
          <DevelopmentScoreModalLink
            developmentScore={developmentScore}
            getUpdateDetailsLink={getUpdateDetailsLink}
            {...props}
          />
        ),

        Metrics: () =>
          MetricsComponent ? <MetricsComponent developmentScore={developmentScore} /> : null,
      }}
      disableExport={
        disableExport ||
        detailsName === "global" ||
        detailsName === "environmentScore" ||
        detailsName === "localPeopleQualityOfLifeScore"
      }
      dataProps={dataPropsWithScore}
    />
  );
}

export default DevelopmentScoreModalDescription;
