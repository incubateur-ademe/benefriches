import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Route } from "type-route";
import { resetState } from "../../application/createProject.reducer";
import { fetchRelatedSite } from "../../application/fetchRelatedSite.action";
import CreateProjectIntroductionPage from "./CreateProjetIntroductionPage";

import { routes } from "@/app/views/router";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  route: Route<typeof routes.createProjectIntro>;
};

function CreateProjectIntroductionContainer({ route }: Props) {
  const dispatch = useAppDispatch();
  const { siteData, siteDataLoadingState } = useAppSelector((state) => state.projectCreation);

  useEffect(() => {
    dispatch(resetState());
    void dispatch(fetchRelatedSite(route.params.siteId));
  }, [route.params.siteId, dispatch]);

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <CreateProjectIntroductionPage
        siteId={route.params.siteId}
        siteName={siteData?.name ?? ""}
        siteLoadingState={siteDataLoadingState}
      />
    </section>
  );
}

export default CreateProjectIntroductionContainer;
