import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { DevelopmentPlanType, FricheActivity } from "shared";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

import NewScenarioTile from "../../features/projects/views/my-projects-page/ScenariiList/ScenarioTile/NewScenarioTile";
import ScenarioTile from "../../features/projects/views/my-projects-page/ScenariiList/ScenarioTile/ScenarioTile";
import StatuQuoScenarioTile from "../../features/projects/views/my-projects-page/ScenariiList/StatuQuoScenarioTile";
import { getScenarioPictoUrl } from "../../features/projects/views/shared/scenarioType";

type Props = {
  siteData: { id: string; name: string; isFriche: boolean; fricheActivity?: FricheActivity };
  projectData: { id: string; name: string; developmentPlan: { type: DevelopmentPlanType } };
};

function DemoMyProjects({ siteData, projectData }: Props) {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isSmScreen = windowInnerWidth < breakpointsValues.sm;

  return (
    <section className="fr-container fr-py-4w">
      <div className={classNames("tw-flex", "tw-justify-between", "tw-items-center")}>
        <h2>Mes projets</h2>
        <div className={classNames("tw-flex", "tw-gap-2", "tw-mb-6")}>
          <div className="tour-guide-step-create-new-site">
            <Button
              disabled
              size={isSmScreen ? "small" : "medium"}
              priority="primary"
              iconId="fr-icon-add-line"
              title="Vous ne pouvez pas créer de nouveau site sur l'espace de démo."
            >
              Nouveau site
            </Button>
          </div>
        </div>
      </div>
      <h4>
        <a {...routes.demoSiteFeatures({ siteId: siteData.id }).link}>{siteData.name}</a>
        <Badge small className="tw-ml-3" style="green-tilleul">
          Site démo
        </Badge>
      </h4>
      <p>1 scenario possible pour ce site :</p>
      <div className="tw-grid sm:tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-6">
        <StatuQuoScenarioTile
          isFriche={siteData.isFriche}
          fricheActivity={siteData.fricheActivity}
          siteId={siteData.id}
        />
        <ScenarioTile
          title={projectData.name}
          linkProps={routes.demoProjectImpactsOnboarding({ projectId: projectData.id }).link}
          pictogramUrl={getScenarioPictoUrl(projectData.developmentPlan.type)}
          badgeText="Project démo"
        />
        <NewScenarioTile />
      </div>
    </section>
  );
}

export default DemoMyProjects;
