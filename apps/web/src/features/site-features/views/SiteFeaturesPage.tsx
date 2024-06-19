import { useEffect } from "react";
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
    return <div>Erreur de chargement des données</div>;
  }

  return (
    <div>
      <SiteFeaturesHeader
        siteName={siteData.name}
        address={siteData.address}
        isFriche={siteData.isFriche}
      />
      <SiteFeaturesList {...siteData} />
    </div>
  );
}

export default SiteFeaturesPage;
