import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { resetState } from "../../application/createSite.reducer";

import { routes } from "@/app/views/router";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function CreateSiteIntroductionPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <section className="tw-py-7 lg:tw-px-[200px]">
        <div className="tw-text-[80px] tw-mb-10 tw-ml-[-18px] tw-leading-none">📍</div>
        <h2 className="tw-mb-10">Tout commence sur un site.</h2>
        <p className="tw-text-xl tw-mb-10">
          Nous allons d'abord parler du <strong>site existant</strong> : la nature du site, la
          typologie de ses sols, les dépenses associées, etc.
          <br />
          Une fois que ce site sera décrit, vous pourrez alors créer un ou plusieurs{" "}
          <strong>projets d'aménagement</strong> sur ce site.
        </p>
        <Button size="large" linkProps={routes.createSiteFoncier().link}>
          Commencer
        </Button>
      </section>
    </section>
  );
}

export default CreateSiteIntroductionPage;
