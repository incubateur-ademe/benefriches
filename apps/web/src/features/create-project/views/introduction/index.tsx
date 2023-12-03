import { useEffect } from "react";
import { Route } from "type-route";
import { fetchRelatedSiteAction } from "../../application/createProject.actions";
import { resetState } from "../../application/createProject.reducer";
import CreateProjectIntroductionPage from "./CreateProjetIntroductionPage";

import { routes } from "@/router";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

type Props = {
  route: Route<typeof routes.createProjectIntro>;
};

function CreateProjectIntroductionContainer({ route }: Props) {
  const dispatch = useAppDispatch();
  const { siteData, siteDataLoadingState } = useAppSelector(
    (state) => state.projectCreation,
  );

  useEffect(() => {
    dispatch(resetState());
    void dispatch(fetchRelatedSiteAction(route.params.siteId));
  }, [route.params.siteId, dispatch]);

  return (
    <CreateProjectIntroductionPage
      siteId={route.params.siteId}
      siteName={siteData?.name ?? ""}
      siteLoadingState={siteDataLoadingState}
    />
  );
}

export default CreateProjectIntroductionContainer;
