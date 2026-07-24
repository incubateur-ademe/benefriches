import { useState } from "react";
import { SiteNature } from "shared";

import HorizontalCheckableTile from "@/shared/views/components/CheckableTile/HorizontalCheckableTile";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { ProjectDevelopmentPlanType } from "../../core/projects.types";
import BreakEvenLevelImpactsActionBar from "../project-break-even-level/ProjectBreakEvenLevelActionBar";
import ProjectPageHeader from "../project-page/header";
import ProjectAvoidedInactionCosts from "./avoided-inaction-costs";
import ProjectAvoidedUrbanSprawlCosts from "./avoided-urban-sprawl-costs";
import UrbanSprawlImpactsComparisonIntroductionModalContainer from "./avoided-urban-sprawl-costs/introduction";
import { ONBOARDING_DIALOG_ID } from "./avoided-urban-sprawl-costs/introduction/IntroModal";

type Props = {
  projectId: string;
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
  evaluationPeriodInYears: number;
  onEvaluationPeriodChange: (value: number) => void;
  shouldDisplayOnBoarding: boolean;
};

const AVOIDED_COSTS_OPTIONS = ["inaction", "urban_sprawl"] as const;

export default function ProjectAvoidedCostsAnalysisPage({
  projectId,
  projectType,
  siteNature,
  evaluationPeriodInYears,
  onEvaluationPeriodChange,
  shouldDisplayOnBoarding,
}: Props) {
  const [avoidedCostsView, setAvoidedCostsView] = useState<"inaction" | "urban_sprawl">(
    AVOIDED_COSTS_OPTIONS[0],
  );

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl mb-0">Analyse des coûts évités</h3>
        <BreakEvenLevelImpactsActionBar
          evaluationPeriod={evaluationPeriodInYears}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ProjectPageHeader projectId={projectId} />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <HorizontalCheckableTile
          small
          title="Coût de l’inaction"
          imgSrc={getPictogramUrlForSiteNature(siteNature)}
          description={
            siteNature === "FRICHE"
              ? `Ce que coûterait la friche si elle n’était pas reconvertie`
              : `Ce que coûterait le site s'il n’était pas reconverti`
          }
          checked={avoidedCostsView === "inaction"}
          onChange={() => {
            setAvoidedCostsView("inaction");
          }}
          checkType="radio"
          noIcon
        />
        <HorizontalCheckableTile
          small
          title="Coût de l’étalement urbain"
          imgSrc={getPictogramUrlForSiteNature(
            siteNature === "FRICHE" ? "AGRICULTURAL_OPERATION" : "FRICHE",
          )}
          description={
            siteNature === "FRICHE"
              ? "Ce que coûterait le projet s’il se faisait sur une exploitation agricole"
              : "Les coûts évités si le projet se faisait sur une friche"
          }
          checked={avoidedCostsView === "urban_sprawl"}
          onChange={() => {
            setAvoidedCostsView("urban_sprawl");
          }}
          checkType="radio"
          noIcon
          dsfrDialogProps={
            shouldDisplayOnBoarding
              ? { "data-fr-opened": false, "aria-controls": ONBOARDING_DIALOG_ID }
              : undefined
          }
        />

        {shouldDisplayOnBoarding && <UrbanSprawlImpactsComparisonIntroductionModalContainer />}
      </div>

      {avoidedCostsView === "inaction" ? (
        <ProjectAvoidedInactionCosts projectType={projectType} siteNature={siteNature} />
      ) : (
        <ProjectAvoidedUrbanSprawlCosts
          projectId={projectId}
          projectType={projectType}
          siteNature={siteNature}
        />
      )}
    </div>
  );
}
