import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import { fetchSiteFeatures } from "@/features/sites/core/fetchSiteFeatures.action";
import { selectSiteFeaturesViewData } from "@/features/sites/core/siteFeatures.selectors";
import SiteFeaturesList from "@/features/sites/views/features/SiteFeaturesList";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  siteId: string;
};

export default function SiteFeaturesContainer({ siteId }: Props) {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectSiteFeaturesViewData);

  useEffect(() => {
    void dispatch(fetchSiteFeatures({ siteId }));
  }, [dispatch, siteId]);

  if (viewData.loadingState === "loading") {
    return <LoadingSpinner />;
  }

  if (viewData.loadingState === "error" || !viewData.siteFeatures) {
    return (
      <Alert
        description="Une erreur s'est produite lors du chargement des caractéristiques du site... Veuillez réessayer."
        severity="error"
        title="Échec du chargement des caractéristiques du site"
        className="my-7"
      />
    );
  }

  return <SiteFeaturesList {...viewData.siteFeatures} />;
}
