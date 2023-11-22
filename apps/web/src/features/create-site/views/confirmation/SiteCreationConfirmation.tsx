import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/router";

type Props = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function SiteCreationConfirmation({ siteId, siteName, loadingState }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <p>Création du site "{siteName}", veuillez patienter...</p>;
    case "error":
      return (
        <p>
          Une erreur est survenue lors de la création du site "{siteName}",
          veuillez réessayer.
        </p>
      );
    case "success":
      return (
        <>
          <h2>✅ Le site "{siteName}" est créé !</h2>
          <p>
            Vous pouvez maintenant découvrir ses caractéristiques géographiques,
            créer un projet sur ce site ou bien renseigner un nouveau site en
            retournant sur votre tableau de bord.
          </p>
          <ButtonsGroup
            buttons={[
              {
                priority: "secondary",
                children: "Retour à mes projets",
                linkProps: routes.projectsList().link,
              },
              {
                priority: "primary",
                children: "Créer un projet sur ce site",
                linkProps: routes.createProjectIntro({ siteId }).link,
              },
            ]}
            inlineLayoutWhen="always"
          />
        </>
      );
  }
}

export default SiteCreationConfirmation;
