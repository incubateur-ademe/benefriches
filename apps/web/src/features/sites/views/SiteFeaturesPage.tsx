import { fr } from "@codegouvfr/react-dsfr";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useEffect } from "react";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { SitePageViewModel } from "../core/siteView.reducer";
import SiteCheckList from "./SiteCheckList";
import SiteCreationConfirmationModal from "./SiteCreationConfirmationModal";
import SiteFeaturesHeader from "./SiteFeaturesHeader";
import SiteFeaturesList from "./SiteFeaturesList";
import SitePageError from "./SitePageError";
import { open } from "./creationConfirmationModal";
import ProjectsList from "./evaluated-projects/EvaluatedProjectsList";

export type SiteTab = "features" | "evaluatedProjects" | "siteActionsList";

type Props = {
  onPageLoad: () => void;
  viewModel: SitePageViewModel;
  selectedTab: SiteTab;
  fromCompatibilityEvaluation: boolean;
  onTabChange: (tab: SiteTab) => void;
};

function SiteFeaturesPage({
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

      const defaultTabs = [
        { tabId: "features", label: "Caractéristiques du site" },
        {
          tabId: "evaluatedProjects",
          label: `Projets évalués (${siteView.reconversionProjects.length})`,
        },
      ];

      const tabs = fromCompatibilityEvaluation
        ? [{ tabId: "siteActionsList", label: "Suivi du site" }, ...defaultTabs]
        : defaultTabs;

      return (
        <>
          <HtmlTitle>{`${siteView.features.name} - Page du site`}</HtmlTitle>
          <SiteFeaturesHeader
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
                  case "siteActionsList":
                    return (
                      <SiteCheckList
                        siteId={siteView.features.id}
                        siteName={siteView.features.name}
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

export default SiteFeaturesPage;
