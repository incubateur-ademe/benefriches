import { fr } from "@codegouvfr/react-dsfr";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

function StatsPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Statistiques</HtmlTitle>
      <h1>Statistiques</h1>
      <iframe
        title="Tableau de bord Metabase des statistiques Bénéfriches"
        src="https://benefriches-metabase.osc-secnum-fr1.scalingo.io/public/dashboard/ca0ba163-c12c-41bf-b0ea-2ce7672ae50a"
        className="border-0"
        width="100%"
        height="600"
        // eslint-disable-next-line react/iframe-missing-sandbox -- Metabase requires both allow-scripts and allow-same-origin
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </section>
  );
}

export default StatsPage;
