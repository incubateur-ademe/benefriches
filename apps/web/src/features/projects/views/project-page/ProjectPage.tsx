import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";
import { Route } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import classNames from "@/shared/views/clsx";
import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";

import ProjectAvoidedCostsAnalysis from "../project-avoided-costs-analysis";
import ProjectBreakEvenLevelTabContainer from "../project-break-even-level";
import ProjectDevelopmentScore from "../project-development-score";
import ProjectSummaryTab from "../project-summary/";
import EconomicImpactsDocumentation from "../shared/impacts/documentation/ImpactDocumentation";
import ProjectFeaturesView from "./features/index";
import ProjectPageHeader from "./header/";
import ProjectPageTabs from "./header/ProjectPageTabs";
import ProjectImpactsView from "./impacts";

type Props = {
  projectId: string;
};

export type ProjectRoute =
  | Route<typeof routes.projectImpactsSummary>
  | Route<typeof routes.projectImpacts>
  | Route<typeof routes.projectFeatures>
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpactsDevelopmentScore>
  | Route<typeof routes.projectAvoidedCostsAnalysis>;

const WithDocumentation = ({
  children,
  route,
  displayDevelopmentScore,
}: {
  children: ReactNode;
  route: ProjectRoute;
  displayDevelopmentScore: boolean;
}) => {
  const isDocumentation = route.params.documentation === true;

  const toggleDocumentationLink = routes[route.name]({
    ...route.params,
    documentation: isDocumentation ? undefined : true,
  }).link;

  const buttonProps: ButtonProps.WithIcon = isDocumentation
    ? {
        iconId: "fr-icon-close-line",
        children: "Retour aux résultats",
      }
    : {
        iconId: "ri-book-2-line",
        children: "Comprendre les résultats",
      };

  return (
    <>
      <div className="w-full flex justify-end my-3">
        <Button
          linkProps={toggleDocumentationLink}
          iconPosition="right"
          size="small"
          priority="tertiary"
          {...buttonProps}
        />
      </div>

      {isDocumentation ? (
        <>
          <div className="fixed w-full left-0 top-0 z-10 bg-white dark:bg-black border-b">
            <div className="fr-container flex items-center justify-between py-4">
              {isDocumentation ? (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-widest text-blue-medium truncate">
                    Documentation
                  </span>
                  Comment sont calculés les impacts économiques ?
                </div>
              ) : (
                <span />
              )}
              <Button
                linkProps={toggleDocumentationLink}
                iconPosition="right"
                size="small"
                priority="tertiary"
                {...buttonProps}
              />
            </div>
          </div>
          <EconomicImpactsDocumentation displayDevelopmentScore={displayDevelopmentScore} />
        </>
      ) : (
        children
      )}
    </>
  );
};

function ProjectPage({ projectId }: Props) {
  const route = useRoute() as ProjectRoute;
  const { useBetaAmenageScoreView } = useAppSelector(selectAppSettings);

  return (
    <div id="project-impacts-page" className={classNames("h-full")}>
      <div className="mb-8 bg-grey-light dark:bg-grey-dark">
        <div className="py-8">
          <ProjectPageHeader projectId={projectId} />
        </div>
        <ProjectPageTabs useBetaAmenageScoreView={useBetaAmenageScoreView} />
      </div>

      <div className="fr-container pb-14">
        {(() => {
          switch (route.name) {
            case "projectFeatures":
              return <ProjectFeaturesView projectId={projectId} />;
            case "projectImpacts":
              return <ProjectImpactsView projectId={projectId} />;
            case "projectImpactsBreakEvenLevel":
              return (
                <WithDocumentation route={route} displayDevelopmentScore={useBetaAmenageScoreView}>
                  <ProjectBreakEvenLevelTabContainer projectId={projectId} />
                </WithDocumentation>
              );
            case "projectImpactsSummary":
              return <ProjectSummaryTab projectId={projectId} />;
            case "projectImpactsDevelopmentScore":
              return useBetaAmenageScoreView ? (
                <WithDocumentation route={route} displayDevelopmentScore={useBetaAmenageScoreView}>
                  <ProjectDevelopmentScore projectId={projectId} />
                </WithDocumentation>
              ) : (
                <NotFoundScreen />
              );
            case "projectAvoidedCostsAnalysis":
              return (
                <WithDocumentation route={route} displayDevelopmentScore={useBetaAmenageScoreView}>
                  <ProjectAvoidedCostsAnalysis projectId={projectId} />
                </WithDocumentation>
              );
          }
        })()}
      </div>
    </div>
  );
}

export default ProjectPage;
