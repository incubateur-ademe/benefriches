import Button from "@codegouvfr/react-dsfr/Button";
import { DevelopmentPlanType, FricheActivity } from "shared";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";
import { routes } from "@/shared/views/router";

import NewScenarioTile from "../../features/projects/views/my-projects-page/ScenariiList/ScenarioTile/NewScenarioTile";
import ScenarioTile from "../../features/projects/views/my-projects-page/ScenariiList/ScenarioTile/ScenarioTile";
import { getScenarioPictoUrl } from "../../features/projects/views/shared/scenarioType";
import MyProjectsTourGuide from "./MyProjectTourGuide";

type Props = {
  siteData: { id: string; name: string; isFriche: boolean; fricheActivity?: FricheActivity };
  projectData: { id: string; name: string; developmentPlan: { type: DevelopmentPlanType } };
};

function DemoMyProjects({ siteData, projectData }: Props) {
  const isSmScreen = useIsSmallScreen();

  return (
    <MyProjectsTourGuide>
      <section className="fr-container fr-py-4w">
        <div className={classNames("tw-flex", "tw-justify-between", "tw-items-center")}>
          <h2>Mes projets</h2>
          <div className={classNames("tw-flex", "tw-gap-2", "tw-mb-6")}>
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
        <h4 className="tour-guide-step-created-site">
          <a {...routes.demoSiteFeatures({ siteId: siteData.id }).link}>{siteData.name}</a>
          <Badge small className="tw-ml-3" style="green-tilleul">
            Site démo
          </Badge>
        </h4>
        <p>Dans ce mode demo, un seul usage possible pour ce site :</p>
        <div className="tw-grid sm:tw-grid-cols-[repeat(auto-fill,_282px)] tw-gap-6">
          <ScenarioTile
            className="tour-guide-step-created-project"
            title={projectData.name}
            linkProps={routes.demoProjectImpactsOnboarding({ projectId: projectData.id }).link}
            pictogramUrl={getScenarioPictoUrl(projectData.developmentPlan.type)}
            badgeText="Projet démo"
          />

          <NewScenarioTile />
        </div>
      </section>
    </MyProjectsTourGuide>
  );
}

export default DemoMyProjects;
