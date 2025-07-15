import Button from "@codegouvfr/react-dsfr/Button";
import { NonUndefined } from "react-hook-form";
import {
  PhotovoltaicInstallationExpense,
  SiteNature,
  UrbanProjectDevelopmentExpense,
} from "shared";

import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import Dialog from "@/shared/views/components/Dialog/Dialog";

import { UrbanSprawlImpactsComparisonObj } from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import { UrbanSprawlImpactsComparisonState } from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import ProjectFeaturesView from "../project-page/features/ProjectFeaturesView";
import AboutImpactsContent from "../shared/impacts/AboutImpactsContent";
import { formatSiteDataAsFeatures } from "./formatSiteData";

type Props = {
  baseCaseSiteData: UrbanSprawlImpactsComparisonObj["baseCase"]["conversionSiteData"];
  comparisonCaseSiteData: UrbanSprawlImpactsComparisonObj["comparisonCase"]["conversionSiteData"];
  projectData: NonUndefined<UrbanSprawlImpactsComparisonState["projectData"]>;
};

const BASE_SITE_FEATURES_DIALOG_ID = "fr-dialog-comparaison-base-site-features";
const COMPARISON_SITE_FEATURES_DIALOG_ID = "fr-dialog-comparaison-other-site-features";
const PROJECT_FEATURES_DIALOG_ID = "fr-dialog-comparison-project-features";
const ABOUT_IMPACTS_DIALOG_ID = "fr-dialog-comparaison-about-impacts";

const getSiteDesignationFromNature = (nature: SiteNature) => {
  switch (nature) {
    case "AGRICULTURAL_OPERATION":
      return "de l'exploitation agricole";
    case "FRICHE":
      return "de la friche";
    case "NATURAL_AREA":
      return "de l'espace naturel";
  }
};

function ImpactsComparisonFooter({ baseCaseSiteData, comparisonCaseSiteData, projectData }: Props) {
  const baseSiteDesignation = getSiteDesignationFromNature(baseCaseSiteData.nature);
  const comparisonSiteDesignation = getSiteDesignationFromNature(comparisonCaseSiteData.nature);
  return (
    <>
      <div className="tw-p-6 tw-bg-white dark:tw-bg-black tw-border tw-border-solid tw-border-borderGrey tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
        <img
          src="/img/pictograms/calculatrice-illustration.svg"
          alt=""
          aria-hidden="true"
          className="tw-w-36"
        />
        <div className="tw-flex tw-flex-col tw-justify-center">
          <h3 className="tw-mb-0">
            Les réponses à vos questions concernant la comparaison des impacts
          </h3>

          <Button
            priority="primary"
            className="tw-my-4"
            nativeButtonProps={{
              "data-fr-opened": false,
              "aria-controls": ABOUT_IMPACTS_DIALOG_ID,
            }}
          >
            Comprendre les calculs
          </Button>
          <div className="tw-flex tw-flex-col md:tw-flex-row tw-flex-wrap md:tw-gap-2">
            <Button
              size="small"
              iconId="fr-icon-map-pin-2-line"
              priority="tertiary no outline"
              nativeButtonProps={{
                "data-fr-opened": false,
                "aria-controls": BASE_SITE_FEATURES_DIALOG_ID,
              }}
            >
              Revoir les données {baseSiteDesignation}
            </Button>
            <Button
              size="small"
              iconId="fr-icon-map-pin-2-line"
              priority="tertiary no outline"
              nativeButtonProps={{
                "data-fr-opened": false,
                "aria-controls": COMPARISON_SITE_FEATURES_DIALOG_ID,
              }}
            >
              Revoir les données {comparisonSiteDesignation}
            </Button>

            <Button
              size="small"
              iconId="fr-icon-briefcase-line"
              priority="tertiary no outline"
              nativeButtonProps={{
                "data-fr-opened": false,
                "aria-controls": PROJECT_FEATURES_DIALOG_ID,
              }}
            >
              Revoir les données du projet
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        dialogId={BASE_SITE_FEATURES_DIALOG_ID}
        title={`Caractéristiques ${baseSiteDesignation}`}
      >
        <SiteFeaturesList {...formatSiteDataAsFeatures(baseCaseSiteData)} />
      </Dialog>
      <Dialog
        dialogId={COMPARISON_SITE_FEATURES_DIALOG_ID}
        title={`Caractéristiques ${comparisonSiteDesignation}`}
      >
        <SiteFeaturesList {...formatSiteDataAsFeatures(comparisonCaseSiteData)} />
      </Dialog>

      <Dialog dialogId={PROJECT_FEATURES_DIALOG_ID} title="Caractéristiques du projet">
        <ProjectFeaturesView
          projectData={{
            ...projectData,
            isExpress: projectData.isExpressProject,
            developmentPlan:
              projectData.developmentPlan.type === "URBAN_PROJECT"
                ? {
                    ...projectData.developmentPlan,
                    installationCosts: projectData.developmentPlan
                      .installationCosts as UrbanProjectDevelopmentExpense[],
                    spaces: projectData.developmentPlan.features.spacesDistribution,
                    buildingsFloorArea:
                      projectData.developmentPlan.features.buildingsFloorAreaDistribution,
                  }
                : {
                    ...projectData.developmentPlan,
                    installationCosts: projectData.developmentPlan
                      .installationCosts as PhotovoltaicInstallationExpense[],

                    ...projectData.developmentPlan.features,
                  },
          }}
        />
      </Dialog>

      <Dialog dialogId={ABOUT_IMPACTS_DIALOG_ID} title="Questions fréquentes">
        <AboutImpactsContent />
      </Dialog>
    </>
  );
}

export default ImpactsComparisonFooter;
