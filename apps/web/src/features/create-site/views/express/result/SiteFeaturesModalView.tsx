import { useEffect } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";

import { fetchSiteFeatures } from "@/features/site-features/application/fetchSiteFeatures.action";
import {
  selectLoadingState,
  selectSiteFeatures,
} from "@/features/site-features/application/siteFeatures.reducer";
import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  siteId: string;
};

export default function SiteFeaturesModalView({ siteId }: Props) {
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
        className="fr-my-7v"
      />
    );
  }

  return <SiteFeaturesList {...siteFeatures} />;
}
