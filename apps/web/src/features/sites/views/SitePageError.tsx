import Alert from "@codegouvfr/react-dsfr/Alert";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

function SitePageError() {
  return (
    <div className="fr-container">
      <HtmlTitle>{`Erreur - Page du site`}</HtmlTitle>
      <Alert
        description="Une erreur s'est produite lors du chargement des caractéristiques du site... Veuillez réessayer."
        severity="error"
        title="Échec du chargement des caractéristiques du site"
        className="my-7"
      />
    </div>
  );
}

export default SitePageError;
