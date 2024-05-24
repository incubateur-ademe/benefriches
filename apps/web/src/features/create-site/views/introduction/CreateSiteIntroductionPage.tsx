import { useEffect } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { resetState } from "../../application/createSite.reducer";

import { routes } from "@/app/views/router";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

function CreateSiteIntroductionPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  return (
    <section className="fr-container fr-py-4w">
      <EditorialPageLayout>
        <EditorialPageIcon>
          {/* we use a negative margin-left to compensate the emoji's left padding */}
          <span className="tw-ml-[-18px]">📍</span>
        </EditorialPageIcon>
        <EditorialPageTitle>Tout commence sur un site.</EditorialPageTitle>
        <EditorialPageText>
          Nous allons d'abord parler du <strong>site existant</strong> : la nature du site, la
          typologie de ses sols, les dépenses associées, etc.
          <br />
          Une fois que ce site sera décrit, vous pourrez alors créer un ou plusieurs{" "}
          <strong>projets d'aménagement</strong> sur ce site.
        </EditorialPageText>
        <Button size="large" linkProps={routes.createSiteFoncier().link}>
          Commencer
        </Button>
      </EditorialPageLayout>
    </section>
  );
}

export default CreateSiteIntroductionPage;
