import { useCallback } from "react";
import { fetchSiteFeatures } from "../application/fetchSiteFeatures.action";
import { selectLoadingState, selectSiteFeatures } from "../application/siteFeatures.reducer";
import SiteFeaturesPage from "./SiteFeaturesPage";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  siteId: string;
};

export default function SiteFeaturesPageContainer({ siteId }: Props) {
  const dispatch = useAppDispatch();
  const siteFeatures = useAppSelector(selectSiteFeatures);
  const loadingState = useAppSelector(selectLoadingState);

  const onPageLoad = useCallback(() => {
    void dispatch(fetchSiteFeatures({ siteId }));
  }, [dispatch, siteId]);

  return (
    <SiteFeaturesPage onPageLoad={onPageLoad} siteData={siteFeatures} loadingState={loadingState} />
  );
}
