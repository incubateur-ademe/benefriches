import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect } from "react";

import { fetchSiteFeatures } from "@/features/sites/core/fetchSiteFeatures.action";
import { selectSiteFeatures } from "@/features/sites/core/siteFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteFeaturesModal from "./SiteFeaturesModal";

type Props = {
  siteId: string;
  dialogId: string;
};

const SiteFeaturesModalContainer = ({ siteId, dialogId }: Props) => {
  const siteFeatures = useAppSelector(selectSiteFeatures);

  const dispatch = useAppDispatch();
  const isOpen = useIsModalOpen({ id: dialogId, isOpenedByDefault: false });

  useEffect(() => {
    if (isOpen) {
      void dispatch(fetchSiteFeatures({ siteId }));
    }
  }, [dispatch, isOpen, siteId]);

  return <SiteFeaturesModal siteFeaturesData={siteFeatures} dialogId={dialogId} />;
};

export default SiteFeaturesModalContainer;
