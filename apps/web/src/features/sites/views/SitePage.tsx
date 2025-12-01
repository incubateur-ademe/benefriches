import { fr } from "@codegouvfr/react-dsfr";
import { useEffect } from "react";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { SitePageViewModel } from "../core/siteView.reducer";
import CompatibilityEvaluation from "./CompatibilityEvaluation";
import SiteCreationConfirmationModal from "./SiteCreationConfirmationModal";
import SitePageError from "./SitePageError";
import SitePageHeader from "./SitePageHeader";
import SiteActionsList from "./actions-list/SiteActionsList";
import { open } from "./creationConfirmationModal";
import ProjectsList from "./evaluated-projects/EvaluatedProjectsList";
import SiteFeaturesList from "./features/SiteFeaturesList";

export type SiteTab = "features" | "evaluatedProjects" | "actionsList" | "compatibilityEvaluation";

type Props = {
  onPageLoad: () => void;
  viewModel: SitePageViewModel;
  selectedTab: SiteTab;
  fromCompatibilityEvaluation: boolean;
};

function SitePage({ onPageLoad, viewModel, selectedTab, fromCompatibilityEvaluation }: Props) {
  useEffect(() => {
    onPageLoad();
  }, [onPageLoad]);

  useEffect(() => {
    if (viewModel.loadingState === "success" && fromCompatibilityEvaluation) {
      const timeoutId = setTimeout(() => {
        open();
      }, 100);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [viewModel.loadingState, fromCompatibilityEvaluation]);

  switch (viewModel.loadingState) {
    case "loading":
    case "idle":
      return (
        <>
          <HtmlTitle>{`Chargement... - Page du site`}</HtmlTitle>
          <LoadingSpinner />
        </>
      );

    case "error":
      return <SitePageError />;

    case "success":
      const { siteView } = viewModel;

      return (
        <>
          <HtmlTitle>{`${siteView.features.name} - Page du site`}</HtmlTitle>
          <SitePageHeader
            siteId={siteView.features.id}
            siteName={siteView.features.name}
            siteNature={siteView.features.nature}
            isExpressSite={siteView.features.isExpressSite}
          />
          <section className={classNames(fr.cx("fr-container"), "py-6 md:py-10")}>
            {(() => {
              switch (selectedTab) {
                case "features":
                  return <SiteFeaturesList {...siteView.features} />;
                case "actionsList":
                  return (
                    <SiteActionsList
                      siteId={siteView.features.id}
                      siteName={siteView.features.name}
                      actions={siteView.actions}
                    />
                  );
                case "evaluatedProjects":
                  return (
                    <ProjectsList
                      siteId={siteView.features.id}
                      projects={siteView.reconversionProjects}
                    />
                  );
                case "compatibilityEvaluation":
                  return (
                    <CompatibilityEvaluation
                      compatibilityEvaluation={siteView.compatibilityEvaluation}
                    />
                  );
              }
            })()}
          </section>
          <SiteCreationConfirmationModal />
        </>
      );
  }
}

export default SitePage;
