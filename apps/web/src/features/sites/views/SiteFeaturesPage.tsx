import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useEffect } from "react";
import { Route } from "type-route";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { routes, useRoute } from "@/shared/views/router";

import { SitePageViewModel } from "../core/siteView.reducer";
import SiteCheckList from "./SiteCheckList";
import SiteCreationConfirmationModal from "./SiteCreationConfirmationModal";
import SiteFeaturesHeader from "./SiteFeaturesHeader";
import SiteFeaturesList from "./SiteFeaturesList";
import { open } from "./creationConfirmationModal";
import ProjectsList from "./evaluated-projects/EvaluatedProjectsList";

type Props = {
  onPageLoad: () => void;
  viewModel: SitePageViewModel;
};

function SiteFeaturesPage({ onPageLoad, viewModel }: Props) {
  useEffect(() => {
    onPageLoad();
  }, [onPageLoad]);

  const route = useRoute();
  const fromCompatibilityEvaluation =
    (route as Route<typeof routes.siteFeatures>).params.fromCompatibilityEvaluation ?? false;

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
      return (
        <div className="fr-container">
          <HtmlTitle>{`Erreur - Page du site`}</HtmlTitle>
          <Alert
            description="Une erreur s'est produite lors du chargement des caractéristiques du site... Veuillez réessayer."
            severity="error"
            title="Échec du chargement des caractéristiques du site"
            className="my-7"
          />
        </div>
      );

    case "success":
      const { siteView } = viewModel;

      const defaultTabs = [
        {
          label: "Caractéristiques du site",
          content: <SiteFeaturesList {...siteView.features} />,
        },
        {
          label: `Projets évalués (${siteView.reconversionProjects.length})`,
          content: (
            <ProjectsList siteId={siteView.features.id} projects={siteView.reconversionProjects} />
          ),
        },
      ];

      const tabs = fromCompatibilityEvaluation
        ? [
            {
              label: "Suivi du site",
              content: (
                <SiteCheckList siteId={siteView.features.id} siteName={siteView.features.name} />
              ),
            },
            ...defaultTabs,
          ]
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
            <Tabs tabs={tabs} />
          </section>
          <SiteCreationConfirmationModal />
        </>
      );

    default:
      return null;
  }
}

export default SiteFeaturesPage;
