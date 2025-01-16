import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect } from "react";

import { fetchSiteFeatures } from "@/features/site-features/core/fetchSiteFeatures.action";
import { selectSiteFeatures } from "@/features/site-features/core/siteFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteFeaturesModal from "./SiteFeaturesModal";
import { siteFeaturesModal } from "./createSiteFeaturesModal";

type Props = {
  siteId: string;
};

const SiteFeaturesModalContainer = ({ siteId }: Props) => {
  const siteFeatures = useAppSelector(selectSiteFeatures);

  const isOpen = useIsModalOpen(siteFeaturesModal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && !siteFeatures) {
      void dispatch(fetchSiteFeatures({ siteId }));
    }
  }, [dispatch, isOpen, siteFeatures, siteId]);

  return <SiteFeaturesModal siteFeaturesData={siteFeatures} isOpen={isOpen} />;
};

export default SiteFeaturesModalContainer;
