import { useEffect } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { SiteFeatures } from "../domain/siteFeatures";
import SiteFeaturesHeader from "./SiteFeaturesHeader";
import SiteFeaturesList from "./SiteFeaturesList";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

type Props = {
  onPageLoad: () => void;
  siteData?: SiteFeatures;
  loadingState: "idle" | "loading" | "success" | "error";
};

function SiteFeaturesPage({ onPageLoad, siteData, loadingState }: Props) {
  useEffect(() => {
    onPageLoad();
  }, [onPageLoad]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  if (loadingState === "error" || !siteData) {
    return (
      <div className="fr-container">
        <Alert
          description="Une erreur s'est produite lors du chargement des caractéristiques du site... Veuillez réessayer."
          severity="error"
          title="Échec du chargement des caractéristiques du site"
          className="fr-my-7v"
        />
      </div>
    );
  }

  return (
    <div>
      <SiteFeaturesHeader
        siteName={siteData.name}
        isExpressSite={siteData.isExpressSite}
        address={siteData.address}
        isFriche={siteData.isFriche}
      />
      <SiteFeaturesList {...siteData} />
    </div>
  );
}

export default SiteFeaturesPage;
