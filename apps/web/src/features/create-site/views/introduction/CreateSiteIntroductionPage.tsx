import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { resetState } from "../../application/createSite.reducer";

import { routes } from "@/app/views/router";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

function CreateSiteIntroductionPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <WizardFormLayout title="Tout commence sur un site">
        <p>
          Nous allons d'abord parler du <strong>site existant</strong> : la nature du site, la
          typologie de ses sols, les dépenses associées, etc.
        </p>
        <p>
          Une fois que ce site sera décrit, vous pourrez alors créer un ou plusieurs{" "}
          <strong>projets d'aménagement</strong> sur ce site.
        </p>
        <Button linkProps={routes.createSiteFoncier().link}>Commencer</Button>
      </WizardFormLayout>
    </section>
  );
}

export default CreateSiteIntroductionPage;
