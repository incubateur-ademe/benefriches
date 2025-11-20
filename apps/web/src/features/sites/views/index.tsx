import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchSiteView } from "../core/fetchSiteView.action";
import { selectSitePageViewModel } from "../core/siteView.reducer";
import SiteFeaturesPage from "./SiteFeaturesPage";

type Props = {
  siteId: string;
};

export default function SiteFeaturesPageContainer({ siteId }: Props) {
  const dispatch = useAppDispatch();
  const sitePageViewModel = useAppSelector((state) => selectSitePageViewModel(state, siteId));

  const onPageLoad = useCallback(() => {
    void dispatch(fetchSiteView({ siteId }));
  }, [dispatch, siteId]);

  return <SiteFeaturesPage onPageLoad={onPageLoad} viewModel={sitePageViewModel} />;
}
