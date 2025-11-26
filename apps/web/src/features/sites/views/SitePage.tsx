import { fr } from "@codegouvfr/react-dsfr";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useEffect } from "react";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { SitePageViewModel } from "../core/siteView.reducer";
import SiteCreationConfirmationModal from "./SiteCreationConfirmationModal";
import SitePageError from "./SitePageError";
import SitePageHeader from "./SitePageHeader";
import SiteActionsList from "./actions-list/SiteActionsList";
import { open } from "./creationConfirmationModal";
import ProjectsList from "./evaluated-projects/EvaluatedProjectsList";
import SiteFeaturesList from "./features/SiteFeaturesList";

export type SiteTab = "features" | "evaluatedProjects" | "actionsList";

type Props = {
  onPageLoad: () => void;
  viewModel: SitePageViewModel;
  selectedTab: SiteTab;
  fromCompatibilityEvaluation: boolean;
  onTabChange: (tab: SiteTab) => void;
};

function SitePage({
  onPageLoad,
  viewModel,
  selectedTab,
  fromCompatibilityEvaluation,
  onTabChange,
}: Props) {
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

      const tabs = [
        { tabId: "actionsList", label: "Suivi du site" },
        { tabId: "features", label: "Caractéristiques du site" },
        {
          tabId: "evaluatedProjects",
          label: `Projets évalués (${siteView.reconversionProjects.length})`,
        },
      ];

      return (
        <>
          <HtmlTitle>{`${siteView.features.name} - Page du site`}</HtmlTitle>
          <SitePageHeader
            siteName={siteView.features.name}
            siteNature={siteView.features.nature}
            isExpressSite={siteView.features.isExpressSite}
            address={siteView.features.address}
          />
          <section className={classNames(fr.cx("fr-container"), "py-6")}>
            <Tabs
              tabs={tabs}
              selectedTabId={selectedTab}
              onTabChange={(tabId) => {
                onTabChange(tabId as SiteTab);
              }}
            >
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
                }
              })()}
            </Tabs>
          </section>
          <SiteCreationConfirmationModal />
        </>
      );
  }
}

export default SitePage;
