import { useMemo } from "react";
import type { Route } from "type-route";

import { routes } from "@/app/router";
import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";

import MdxContentDialog from "../../impact-description-modals/lazy-component/MdxContentDialog";
import useImpactListModalContent from "../../impact-description-modals/useImpactListModalContent";
import useToggleDescriptionModal from "../../impact-description-modals/useToggleDescriptionModal";
import { developmentScoreMdxComponents } from "../../shared/impacts/documentation/mdxComponents";
import DevelopmentScoreModalLink from "./DevelopmentScoreModalLink";
import { DEVELOPMENT_SCORE_CONFIG_MODALS } from "./developmentScoreModalsConfig";
import { type DetailsName, parseDetails, serializeDetails } from "./useOpenDescriptionModalLink";

type Props = DevelopmentScoreDataView & {
  route: Route<typeof routes.projectImpactsDevelopmentScore>;
};

function DevelopmentScoreModalDescription({ developmentScore, route, modalsData }: Props) {
  const detailsName = useMemo(() => parseDetails(route.params.details), [route.params.details]);

  const { getUpdateDetailsLink } = useMemo(
    () => ({
      getLink: (detailsName?: DetailsName) =>
        routes[route.name]({
          ...route.params,
          details: detailsName ? serializeDetails(detailsName) : undefined,
        }).link,
      getUpdateDetailsLink: (details?: string) =>
        routes[route.name]({
          ...route.params,
          details,
        }).link,
    }),
    [route],
  );

  const config = detailsName ? DEVELOPMENT_SCORE_CONFIG_MODALS[detailsName] : undefined;

  const {
    contentState: impactsListModalsMatchedState,
    getDetailsLink: getImpactListModalContentLink,
  } = useToggleDescriptionModal({
    route,
    getRouteFn: routes.projectImpactsDevelopmentScore,
  });

  const isImpactListDetailsContent =
    impactsListModalsMatchedState.sectionName &&
    impactsListModalsMatchedState.sectionName !== "summary" &&
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

  return (
    <MdxContentDialog
      modalsData={modalsData}
      route={route}
      getRouteFn={routes[route.name]}
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
        detailsName === "global" ||
        detailsName === "environmentScore" ||
        detailsName === "localPeopleQualityOfLifeScore"
      }
      dataProps={
        dataProps
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
            }
      }
    />
  );
}

export default DevelopmentScoreModalDescription;
