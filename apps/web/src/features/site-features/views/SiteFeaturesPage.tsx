import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useEffect } from "react";
import { Route } from "type-route";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { routes, useRoute } from "@/shared/views/router";

import { SiteFeatures } from "../core/siteFeatures";
import SiteCheckList from "./SiteCheckList";
import SiteFeaturesHeader from "./SiteFeaturesHeader";
import SiteFeaturesList from "./SiteFeaturesList";

type Props = {
  onPageLoad: () => void;
  siteData?: SiteFeatures;
  loadingState: "idle" | "loading" | "success" | "error";
};

function SiteFeaturesPage({ onPageLoad, siteData, loadingState }: Props) {
  useEffect(() => {
    onPageLoad();
  }, [onPageLoad]);

  const route = useRoute();
  const fromCompatibilityEvaluation =
    (route as Route<typeof routes.siteFeatures>).params.fromCompatibilityEvaluation ?? false;

  if (loadingState === "loading" || !siteData) {
    return (
      <>
        <HtmlTitle>{`Chargement... - Caractéristiques du site`}</HtmlTitle>
        <LoadingSpinner />
      </>
    );
  }

  if (loadingState === "error") {
    return (
      <div className="fr-container">
        <HtmlTitle>{`Erreur - Caractéristiques du site`}</HtmlTitle>
        <Alert
          description="Une erreur s'est produite lors du chargement des caractéristiques du site... Veuillez réessayer."
          severity="error"
          title="Échec du chargement des caractéristiques du site"
          className="my-7"
        />
      </div>
    );
  }
  const defaultTabs = [
    {
      label: "Caractéristiques du site",
      content: <SiteFeaturesList {...siteData} />,
    },
  ];

  const tabs = fromCompatibilityEvaluation
    ? [...defaultTabs, { label: "Suivi du site", content: <SiteCheckList siteId={siteData.id} /> }]
    : defaultTabs;

  return (
    <>
      <HtmlTitle>{`${siteData.name} - Caractéristiques du site`}</HtmlTitle>
      <SiteFeaturesHeader
        siteName={siteData.name}
        siteNature={siteData.nature}
        isExpressSite={siteData.isExpressSite}
        address={siteData.address}
      />
      <section className={classNames(fr.cx("fr-container"), "lg:px-24", "py-6")}>
        <Tabs tabs={tabs} />
      </section>
    </>
  );
}

export default SiteFeaturesPage;
