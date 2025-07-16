import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { SiteFeatures } from "../core/siteFeatures";
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
          className="tw-my-7"
        />
      </div>
    );
  }

  return (
    <>
      <HtmlTitle>{`${siteData.name} - Caractéristiques du site`}</HtmlTitle>
      <SiteFeaturesHeader
        siteName={siteData.name}
        siteNature={siteData.nature}
        isExpressSite={siteData.isExpressSite}
        address={siteData.address}
      />
      <section className={classNames(fr.cx("fr-container"), "lg:tw-px-24", "tw-py-6")}>
        <SiteFeaturesList {...siteData} />
      </section>
    </>
  );
}

export default SiteFeaturesPage;
