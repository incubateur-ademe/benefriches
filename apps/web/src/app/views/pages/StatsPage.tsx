import { fr } from "@codegouvfr/react-dsfr";

function StatsPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Statistiques</h1>
      <iframe
        src="http://benefriches-metabase.osc-secnum-fr1.scalingo.io/public/dashboard/ca0ba163-c12c-41bf-b0ea-2ce7672ae50a"
        className="tw-border-0"
        width="100%"
        height="600"
      ></iframe>
    </section>
  );
}

export default StatsPage;
