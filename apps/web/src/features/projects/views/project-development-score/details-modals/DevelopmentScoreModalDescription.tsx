import { useMemo } from "react";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";

import MdxContentDialog from "../../impact-description-modals/lazy-component/MdxContentDialog";
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

function DevelopmentScoreModalDescription({
  developmentScore,
  modalsData,
  routeParamsDetails,
  getUpdateRouteDetailsFn,
  disableExport = false,
}: Props) {
  const detailsName = useMemo(() => parseDetails(routeParamsDetails), [routeParamsDetails]);

  const { getUpdateDetailsLink } = useMemo(
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
