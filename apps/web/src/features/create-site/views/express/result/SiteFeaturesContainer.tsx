import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import { fetchSiteFeatures } from "@/features/sites/core/fetchSiteFeatures.action";
import { selectLoadingState, selectSiteFeatures } from "@/features/sites/core/siteFeatures.reducer";
import SiteFeaturesList from "@/features/sites/views/SiteFeaturesList";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  siteId: string;
};

export default function SiteFeaturesContainer({ siteId }: Props) {
  const dispatch = useAppDispatch();
  const siteFeatures = useAppSelector(selectSiteFeatures);
  const loadingState = useAppSelector(selectLoadingState);

  useEffect(() => {
    void dispatch(fetchSiteFeatures({ siteId }));
  }, [dispatch, siteId]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  if (loadingState === "error" || !siteFeatures) {
    return (
      <Alert
        description="Une erreur s'est produite lors du chargement des caractéristiques du site... Veuillez réessayer."
        severity="error"
        title="Échec du chargement des caractéristiques du site"
        className="my-7"
      />
    );
  }

  return <SiteFeaturesList {...siteFeatures} />;
}
